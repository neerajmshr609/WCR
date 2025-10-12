import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';
import { map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { IceBreakerTemplateService } from '../../services/ice-breaker-template.service';
import {
  IceBreakerTemplateMessage,
  IceBreakerType,
  PriceConditionsResult,
} from '../../ice-breaker-template-messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { FooterService } from 'src/app/services/footer/footer.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { COMPANION_URL } from 'src/config/config';
import { User } from 'src/app/shared/models/user.model';
import { PROFILE_PATH } from 'src/app/pages/profile/routing/profile.paths';
import { isScrollable } from 'src/app/shared/components/scroll-btn/is-scrollable';
import { ICE_BREAKER_PATH } from 'src/app/ice-breaker/routing/ice-breaker.paths';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-ice-breaker-template',
  templateUrl: './ice-breaker-template.component.html',
  styleUrls: ['./ice-breaker-template.component.scss'],
  providers: [IceBreakerTemplateService],
})
export class IceBreakerTemplateComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @ViewChild('containerOfMessages')
  private readonly messagesContainer: ElementRef;
  private uploader = new Uppy({ id: 'message-screenshot-uploader' }).use(
    AwsS3,
    {
      companionUrl: COMPANION_URL,
      metaFields: ['folder'],
    },
  );
  private currentUser: User;
  public isRecording: boolean;

  currentUser$: Observable<User> = this.authService.userSubject$.pipe(
    tap((user: User) => {
      this.currentUser = user;
      if (user) {
        this.shareLink = `${this._appDocument.location.origin}/${PROFILE_PATH.toRelativeUrl()}/${user.sharetoken}/${ICE_BREAKER_PATH.toRelativeUrl()}`;
      }
    }),
  );
  messages$: Observable<IceBreakerTemplateMessage[]> =
    this.iceBreakerTemplateService.messages$.pipe(
      tap(() => {
        setTimeout(() => {
          this.isCanScroll = isScrollable(this.messagesContainer.nativeElement);
        }, 0);
      }),
    );
  showSetPrice$: Observable<boolean> =
    this.iceBreakerTemplateService.isSetPrice.asObservable();
  showSetTitle: Observable<boolean> =
    this.iceBreakerTemplateService.isSetTitle.asObservable();
  showSetDescription$: Observable<boolean> =
    this.iceBreakerTemplateService.isSetDescription.asObservable();
  showAllowOrgLevel$: Observable<boolean> =
    this.iceBreakerTemplateService.isSetAllowOrgLevel.asObservable();
  showAllowPlatformLevel$: Observable<boolean> =
    this.iceBreakerTemplateService.isSetAllowPlatformLevel.asObservable();
  showSetRichMediaContentThumbnail$ =
    this.iceBreakerTemplateService.isSetRichMediaContentThumbnail.asObservable();
  isCompleteIceBreaker$ = this.iceBreakerTemplateService.isCompleteIceBreaker
    .asObservable()
    .pipe(
      tap((data: { id: number }) => {
        if (data && data.id) {
          this.shareLink = `${this.shareLink}?id=${data.id}`;
        }
      }),
      shareReplay(),
    );
  confirmationState$: Observable<boolean> =
    this.iceBreakerTemplateService.confirmationSateBeforeSetIceBreakerType$;
  isSetIceBreakerType$: Observable<boolean> =
    this.iceBreakerTemplateService.isSetIceBreakerType$;
  iceBreakerType$: Observable<IceBreakerType> =
    this.iceBreakerTemplateService.iceBreakerType$;
  messageSentEvt = new EventEmitter<void>();
  stepQuestions: IceBreakerTemplateMessage[] = [];
  shareLink = '';
  readonly userSkillId = input<number>();

  isCanScroll = false;
  readonly ICEBREAKER_TYPES = IceBreakerType;

  showYesNoType$ = combineLatest([
    this.showAllowOrgLevel$,
    this.showAllowPlatformLevel$,
  ]).pipe(
    map((state: boolean[]) => state.some((condition: boolean) => condition)),
    shareReplay(),
  );

  canTypeText$ = combineLatest([
    this.showSetPrice$,
    this.isSetIceBreakerType$,
    this.confirmationState$,
    this.showYesNoType$,
  ]).pipe(
    map((state: boolean[]) => state.every((condition: boolean) => !condition)),
    shareReplay(),
  );

  showCreateQuestion$ = combineLatest([
    this.showSetPrice$,
    this.showSetTitle,
    this.showSetDescription$,
    this.showAllowOrgLevel$,
    this.showAllowPlatformLevel$,
    this.confirmationState$,
    this.isSetIceBreakerType$,
    this.showSetRichMediaContentThumbnail$,
  ]).pipe(
    map((state: boolean[]) => state.every((condition: boolean) => !condition)),
    shareReplay(),
  );

  trackByDate = (index: number, message: IceBreakerTemplateMessage) =>
    message.created_at;

  constructor(
    private readonly authService: AuthService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private iceBreakerTemplateService: IceBreakerTemplateService,
    private _footerService: FooterService,
    @Inject(DOCUMENT)
    private readonly _appDocument: Document,
  ) {
    super();
    this.translateService.store.onLangChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((lang: LangChangeEvent) => {
        this.translateService.use(lang.lang);
      });
  }

  ngOnInit() {
    this._footerService.hideFooter();
  }

  async sendMessage(message: IceBreakerTemplateMessage): Promise<void> {
    const file = message.message_screenshots[0].file;
    message.message_screenshots_attributes = [];
    delete message.message_screenshots;
    if (file) {
      try {
        const uploadedFile = await this.useUploader(
          file,
          'message-screenshot-' + new Date().getTime(),
        );
        message.message_screenshots_attributes = [
          { url: decodeURIComponent(uploadedFile.successful[0].uploadURL) },
        ];
        this.iceBreakerTemplateService.addNewOwnMessageToMessageStore(message);
        this.stepQuestions = [...this.stepQuestions, message];
        this.messageSentEvt.emit();
        return;
      } catch {
        this.snackBar.open('Something went wrong!', null, {
          duration: 5000,
        });
        return;
      }
    }
    if (!this.iceBreakerTemplateService.isSetRichMediaContentThumbnail.value) {
      this.stepQuestions = [...this.stepQuestions, message];
    }
    this.iceBreakerTemplateService.addNewOwnMessageToMessageStore(message);
    this.messageSentEvt.emit();
  }

  nextQuestion(): void {
    this.iceBreakerTemplateService.nextQuestion();
    this.saveUserQuestions();
  }

  private saveUserQuestions() {
    this.iceBreakerTemplateService.saveUserQuestions(this.stepQuestions);
    this.stepQuestions = [];
  }

  getTitleMessageTemplate(): void {
    this.iceBreakerTemplateService.getTitleMessages(this.userSkillId());
  }

  onPriceChanged(priceConditionsResult: PriceConditionsResult) {
    this.saveUserQuestions();
    this.iceBreakerTemplateService.setPrice(
      priceConditionsResult,
      this.userSkillId(),
    );
  }

  readyToSetIceBreakerType(state: boolean): void {
    this.iceBreakerTemplateService.showConfirmation(state);
  }

  readyToSetPrice(iceBreakerType: IceBreakerType): void {
    this.iceBreakerTemplateService.setPriceState(true);
    this.iceBreakerTemplateService.setIceBreakerType(iceBreakerType);
  }

  confirmToSetIceBreakerType(isAccept: boolean): void {
    this.iceBreakerTemplateService.showSetIceBreakerTypeState(isAccept);
    this.readyToSetPrice(this.ICEBREAKER_TYPES.OTHERS_PAY_ME);
    this.onPriceChanged({
      price: 10 * 10,
      countOfPeople: 10,
    });
  }

  skipStep(): void {
    this.iceBreakerTemplateService.startAskQuestion();
  }

  backToSetType(): void {
    this.iceBreakerTemplateService.isSetPrice.next(false);
    this.iceBreakerTemplateService.showSetIceBreakerTypeState(true);
  }

  private async useUploader(blob: File, title: string) {
    this.uploader.addFile({
      data: blob,
      name: title,
      source: 'file input',
      type: blob.type,
    });
    const userId = this.currentUser.id;
    this.uploader.setMeta({ folder: `users/${userId}/message-screenshots` });

    const uploadedFile = await this.uploader.upload();
    this.uploader.reset();
    return uploadedFile;
  }

  scrollHistory(bottom: boolean = true): void {
    const history = this.messagesContainer.nativeElement;
    history?.scrollTo({ top: bottom ? history.scrollHeight : 0 });
  }

  saveYesNoAnswer(isAccept: boolean, text: string): void {
    this.iceBreakerTemplateService.addNewOwnMessageToMessageStore({
      isOwner: false,
      body: this.translateService.instant(text),
      additional_attributes: { accept: isAccept },
      message_screenshots: [],
      message_screenshots_attributes: [],
      isTitle: false,
    });
    this.messageSentEvt.emit();
  }
}
