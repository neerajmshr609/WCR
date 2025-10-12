import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, interval, Subject } from 'rxjs';
import {
  getRegularNextQuestionMessage,
  getRegularSetValidUrlMessage,
  IceBreaker,
  ICEBREAKER_TEMPLATE_ALLOW_ORG_LEVEL_MESSAGES,
  ICEBREAKER_TEMPLATE_ALLOW_PLATFORM_LEVEL_MESSAGES,
  ICEBREAKER_TEMPLATE_DESCRIPTION_MESSAGES,
  ICEBREAKER_TEMPLATE_MESSAGES,
  ICEBREAKER_TEMPLATE_TITLE_MESSAGES,
  IceBreakerTemplateMessage,
  IceBreakerType,
  invoicePaymentRequestMessage,
  LAST_MESSAGE,
  PriceConditionsResult,
  successValidUrlMessage,
} from '../ice-breaker-template-messages';
import {
  catchError,
  filter,
  map,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { IframelyService } from 'src/app/services/iframely.service';
import { SafeHtml } from '@angular/platform-browser';
import { isUrlString } from 'src/app/shared/functions/is-url-string';
import { generateId } from '../generate-id';
import { MatDialog } from '@angular/material/dialog';
import { PaymentModalComponent } from '../components/payment-modal/payment-modal.component';
import { IceBreakerService } from 'src/app/ice-breaker/service/ice-breaker.service';
import { IS_CREATED_ICE_BREAKER_BEFORE } from 'src/app/shared/constants';
import {
  BasePaymentRequest,
  IceBreakerPaymentRequest,
} from 'src/app/shared/models/payment-request';

@Injectable()
export class IceBreakerTemplateService implements OnDestroy {
  // creation of ice breaker values
  private readonly TEMPLATE_QUESTIONS_MESSAGES = ICEBREAKER_TEMPLATE_MESSAGES;
  private readonly messagesStore = new BehaviorSubject<
    IceBreakerTemplateMessage[]
  >(this.TEMPLATE_QUESTIONS_MESSAGES[0]);
  private readonly TEMPLATE_TITLE_MESSAGES = ICEBREAKER_TEMPLATE_TITLE_MESSAGES;
  private readonly TEMPLATE_LAST_MESSAGE = LAST_MESSAGE;
  private userSkillId: number;
  private readonly destroy$ = new Subject();
  readonly messages$ = this.messagesStore.asObservable(); // messages stream chat
  readonly isSetPrice = new BehaviorSubject<boolean>(false); // does user should set price
  readonly isSetTitle = new BehaviorSubject<boolean>(false); // does user should set title
  readonly isSetDescription = new BehaviorSubject<boolean>(false);
  readonly isSetAllowOrgLevel = new BehaviorSubject<boolean>(false);
  readonly isSetAllowPlatformLevel = new BehaviorSubject<boolean>(false);
  readonly savedUserQuestions = new BehaviorSubject<
    IceBreakerTemplateMessage[][]
  >([]);
  readonly stepOfQuestionTemplate$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  readonly iceBreakerTitle = new BehaviorSubject<string>(''); // Title of ice breaker
  readonly iceBreakerDescription = new BehaviorSubject<string>('');
  readonly iceBreakerAllowOrgLevel = new BehaviorSubject<boolean>(false);
  readonly iceBreakerAllowPlatformLevel = new BehaviorSubject<boolean>(false);
  iceBreakerPrice: BehaviorSubject<PriceConditionsResult> =
    new BehaviorSubject<PriceConditionsResult>({ price: 0, countOfPeople: 0 }); // Price of ice breaker
  readonly isCompleteIceBreaker = new BehaviorSubject<{ id: number }>(null); // Is completed Ice Breaker
  readonly isSetRichMediaContentThumbnail = new BehaviorSubject<boolean>(false); // does user should set preview media url of Ice breaker
  private readonly richMediaContentUrl = new BehaviorSubject<string>(''); // preview media url of Ice breaker
  private confirmationStateBeforeSetIceBreakerType =
    new BehaviorSubject<boolean>(false);
  readonly confirmationSateBeforeSetIceBreakerType$ =
    this.confirmationStateBeforeSetIceBreakerType.asObservable();

  private isSetIceBreakerType = new BehaviorSubject<boolean>(false);
  readonly isSetIceBreakerType$ = this.isSetIceBreakerType.asObservable();

  private readonly iceBreakerType = new BehaviorSubject<IceBreakerType>(
    IceBreakerType.OTHERS_PAY_ME,
  );
  readonly iceBreakerType$ = this.iceBreakerType.asObservable();

  constructor(
    private readonly iceBreakerService: IceBreakerService,
    private readonly authService: AuthService,
    private readonly iframelyService: IframelyService,
    private readonly dialog: MatDialog,
  ) {}

  nextQuestion(): void {
    this.isSetPrice.next(false);
    this.isSetTitle.next(false);
    this.isCompleteIceBreaker.next(null);
    this.stepOfQuestionTemplate$.next(this.stepOfQuestionTemplate$.value + 1);
    if (
      this.stepOfQuestionTemplate$.value < ICEBREAKER_TEMPLATE_MESSAGES.length
    ) {
      this.messagesStore.next(
        this.addNewMessagesToMessagesStore([
          ICEBREAKER_TEMPLATE_MESSAGES[this.stepOfQuestionTemplate$.value][0],
        ]),
      );
      setTimeout(
        () =>
          this.messagesStore.next(
            this.addNewMessagesToMessagesStore([
              ICEBREAKER_TEMPLATE_MESSAGES[
                this.stepOfQuestionTemplate$.value
              ][1],
            ]),
          ),
        2000,
      );
      return;
    }
    this.messagesStore.next(
      this.addNewMessagesToMessagesStore(
        getRegularNextQuestionMessage(this.stepOfQuestionTemplate$.value),
      ),
    );
  }

  saveUserQuestions(questions: IceBreakerTemplateMessage[]): void {
    // Check if right now user trying to set rich media content thumbnail of ice breaker, if yes then this message
    // not a question of user
    if (this.isSetRichMediaContentThumbnail.value) {
      questions = questions.map((message: IceBreakerTemplateMessage) => ({
        ...message,
        isQuestion: false,
      }));
    } else {
      questions = questions.map((message: IceBreakerTemplateMessage) => ({
        ...message,
        isQuestion: true,
      }));
    }
    this.savedUserQuestions.next([...this.savedUserQuestions.value, questions]);
  }

  addNewOwnMessageToMessageStore(message: IceBreakerTemplateMessage) {
    const isTitle = this.isSetTitle.value;
    const isDescription = this.isSetDescription.value;
    const isAllowOrgLevel = this.isSetAllowOrgLevel.value;
    const isAllowPlatformLevel = this.isSetAllowPlatformLevel.value;
    const isRichMediaContentThumbnail =
      this.isSetRichMediaContentThumbnail.value;
    const isQuestion =
      !isTitle &&
      !isDescription &&
      !isAllowOrgLevel &&
      !isAllowPlatformLevel &&
      !isRichMediaContentThumbnail;

    message = { ...message, isQuestion: isQuestion };
    const newMessage = {
      ...message,
      isOwner: true,
      isTitle,
      created_at: new Date().toString(),
    };
    this.messagesStore.next(this.addNewMessagesToMessagesStore([newMessage]));

    // Check if title
    if (isTitle) {
      this.setTitle(message.body);
      this.messagesStore.next(
        this.addNewMessagesToMessagesStore(
          ICEBREAKER_TEMPLATE_DESCRIPTION_MESSAGES,
        ),
      );
      this.isSetTitle.next(false);
      this.isSetDescription.next(true);
    } else if (isRichMediaContentThumbnail) {
      this.validateSupportUrlString(message.body);
    } else if (isDescription) {
      this.isSetDescription.next(false);
      this.iceBreakerDescription.next(message.body);
      this.messagesStore.next(
        this.addNewMessagesToMessagesStore(
          ICEBREAKER_TEMPLATE_ALLOW_ORG_LEVEL_MESSAGES,
        ),
      );
      this.isSetAllowOrgLevel.next(true);
    } else if (isAllowOrgLevel) {
      this.isSetAllowOrgLevel.next(false);
      this.iceBreakerAllowOrgLevel.next(message.additional_attributes?.accept);
      this.messagesStore.next(
        this.addNewMessagesToMessagesStore(
          ICEBREAKER_TEMPLATE_ALLOW_PLATFORM_LEVEL_MESSAGES,
        ),
      );
      this.isSetAllowPlatformLevel.next(true);
    } else if (isAllowPlatformLevel) {
      this.isSetAllowPlatformLevel.next(false);
      this.iceBreakerAllowPlatformLevel.next(
        message.additional_attributes?.accept,
      );
      this.getLastMessages();
      this.saveIceBreaker(this.authService.userSubject$.value.id);
    }
  }

  private saveIceBreaker(user_id: number) {
    const iceBreaker: IceBreaker = {
      title: this.iceBreakerTitle.value,
      // price: this.iceBreakerPrice.value.price,
      preview_media_url: this.richMediaContentUrl.value,
      description: this.iceBreakerDescription.value,
      allowOrgLevel: this.iceBreakerAllowOrgLevel.value,
      allowPlatformLevel: this.iceBreakerAllowPlatformLevel.value,
      // icebreaker_type: this.iceBreakerType.value,
      // allow_quantity: this.iceBreakerPrice.value?.countOfPeople || undefined,
      questions: this.savedUserQuestions.value.map(
        (m: IceBreakerTemplateMessage[]) => {
          // @ts-ignore
          const stepOfQuestions: IceBreakerTemplateMessage[] = m
            .filter(
              (messages: IceBreakerTemplateMessage) => messages.isQuestion,
            )
            .map((messages: IceBreakerTemplateMessage) => {
              delete messages.isQuestion;
              return {
                id: generateId(),
                body: {
                  ...messages,
                  user_id,
                },
              };
            });
          return {
            id: generateId(),
            questions: stepOfQuestions,
          };
        },
      ),
      user_skill_id: +this.userSkillId,
    };

    this.iceBreakerService
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .createIceBreaker(iceBreaker)
      .pipe(
        tap((createdIceBreaker: IceBreaker) => {
          this.isCompleteIceBreaker.next({ id: createdIceBreaker.id });
          // set to local storage flag about if ever created ice breaker
          localStorage.setItem(IS_CREATED_ICE_BREAKER_BEFORE, 'true');
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private setTitle(title: string) {
    this.iceBreakerTitle.next(title);
  }

  setPrice(priceConditions: PriceConditionsResult, userSkillId: number) {
    if (this.iceBreakerType.value === IceBreakerType.OTHERS_PAY_ME) {
      this.iceBreakerPrice.next(priceConditions);
      this.getTitleMessages(userSkillId);
      return;
    }
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      maxWidth: 360,
      width: '100%',
      height: '690px',
      data: {
        price: priceConditions.price,
        countOfPeople: priceConditions.countOfPeople,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((paymentRequest: BasePaymentRequest) => !!paymentRequest),
        tap((paymentRequest: IceBreakerPaymentRequest) => {
          this.iceBreakerPrice.next(priceConditions);
          this.showInvoiceMessageRequest(paymentRequest);
          this.getTitleMessages(userSkillId);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setIceBreakerType(type: IceBreakerType): void {
    this.iceBreakerType.next(type);
    this.isSetIceBreakerType.next(false);
  }

  setPriceState(state: boolean): void {
    this.isSetPrice.next(state);
  }

  showConfirmation(state: boolean): void {
    this.confirmationStateBeforeSetIceBreakerType.next(state);
  }

  showSetIceBreakerTypeState(state: boolean): void {
    this.showConfirmation(false);
    this.isSetIceBreakerType.next(state);
  }

  getTitleMessages(userSkillId: number): void {
    this.userSkillId = userSkillId;
    interval(1000)
      .pipe(
        takeWhile((iterate) => iterate < this.TEMPLATE_TITLE_MESSAGES.length),
        map((iterate) => this.TEMPLATE_TITLE_MESSAGES[iterate]),
        takeUntil(this.destroy$),
      )
      .subscribe((message: IceBreakerTemplateMessage) => {
        this.messagesStore.next(this.addNewMessagesToMessagesStore([message]));
      });
    this.isSetTitle.next(true);
    this.isSetPrice.next(false);
  }

  private getLastMessages(): void {
    this.messagesStore.next(
      this.addNewMessagesToMessagesStore(this.TEMPLATE_LAST_MESSAGE),
    );
  }

  private showInvoiceMessageRequest(
    paymentRequest: IceBreakerPaymentRequest,
  ): void {
    this.messagesStore.next(
      this.addNewMessagesToMessagesStore([
        invoicePaymentRequestMessage(paymentRequest),
      ]),
    );
  }

  private addNewMessagesToMessagesStore(
    newMessages: IceBreakerTemplateMessage[],
  ): IceBreakerTemplateMessage[] {
    return [...this.messagesStore.value, ...newMessages];
  }

  private validateSupportUrlString(url: string) {
    if (isUrlString(url)) {
      this.iframelyService
        .getIframeSrc(url)
        .pipe(
          tap((res: SafeHtml) => {
            this.messagesStore.next(
              this.addNewMessagesToMessagesStore(successValidUrlMessage(res)),
            );
            this.startAskQuestion();
            this.richMediaContentUrl.next(url);
          }),
          catchError(() => {
            this.messagesStore.next(
              this.addNewMessagesToMessagesStore(getRegularSetValidUrlMessage),
            );
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
      return;
    }
    this.messagesStore.next(
      this.addNewMessagesToMessagesStore(getRegularSetValidUrlMessage),
    );
  }

  startAskQuestion(): void {
    this.isSetRichMediaContentThumbnail.next(false);
    this.messagesStore.next(
      this.addNewMessagesToMessagesStore(this.TEMPLATE_QUESTIONS_MESSAGES[0]),
    );
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
