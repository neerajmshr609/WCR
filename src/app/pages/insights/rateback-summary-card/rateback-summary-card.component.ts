import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  forkJoin,
  from,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClipboardService } from 'ngx-clipboard';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { InsightsService } from 'src/app/services/insights.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  catchError,
  filter,
  finalize,
  mergeMap,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { RatebackEvt } from 'src/app/shared/models/rateback';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { ConversationsService } from 'src/app/services/conversations.service';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { MessagesService } from 'src/app/services/messages.service';
import { Conversation } from 'src/app/shared/models/conversation.model';
import { AudioMessage, Message } from 'src/app/shared/models/message.model';
import { TipsTypes } from 'src/app/shared/enums';
import { PaymentRequestTips } from 'src/app/shared/models/payment-request';
import { RatebackObject } from 'src/app/shared/models/rateback-object';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare let Stripe: any;

@Component({
  selector: 'app-rateback-summary-card',
  templateUrl: './rateback-summary-card.component.html',
  styleUrls: ['./rateback-summary-card.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0.0 }),
        animate(150, style({ opacity: 1.0 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(150, style({ opacity: 0.0 })),
      ]),
    ]),
  ],
})
export class RatebackSummaryCardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @Input() itemDidReceiveRateback$: BehaviorSubject<RatebackEvt>;
  @Input() raterID: number;
  @Input() project: Project;
  @Input() feedbackSessionId: number;
  @Input() trustedAdvisor: boolean;
  @Input() feedbacks: NewsfeedFeedback[];
  @Input() paid: boolean;
  @Input() link: string;

  tips: PaymentRequestTips;

  stripe: any;
  clientSecret: string;
  paymentInProgress: boolean;
  private paymentId: string;
  bankCardPayment: boolean;
  secret: string;
  intentInProgress: boolean;
  paymentCompleted: boolean;
  finishing: boolean;

  public slide = 1;
  isConnect = false;

  isInspiring = false;
  isHelpful = false;
  isDisconnect = false;
  isDiscouraging = false;
  isUnhelpful = false;

  isErrorSetupPayment = false;
  isErrorRegistered = false;

  isRecommend = false;
  isConnected = false;

  paymentError: string;
  currentSliderValue: number;
  loadedRater: User;

  ratebacks: RatebackObject = {};

  currentRatebacks: { [id: number]: number } = {};

  ratebacksCount = new Set<number>();

  raterShareToken: string;
  urlCopied: boolean;
  isExternal: boolean;

  activeSubscription$ = new Subscription();
  private conversation: Conversation;

  tipsPaymentProcessing: boolean;
  private _tipsPaymentProcessing$ = new Subject<{
    processing: boolean;
    id: number;
  }>();
  public get tipsPaymentProcessing$(): Observable<{
    processing: boolean;
    id: number;
  }> {
    return this._tipsPaymentProcessing$.pipe(shareReplay(1));
  }

  private _paymentProcessing$ = new Subject<{
    processing: boolean;
    id: number;
  }>();
  public get processing$(): Observable<{ processing: boolean; id: number }> {
    return this._paymentProcessing$.pipe(shareReplay(1));
  }

  public get isAnon(): boolean {
    return this.authService.isAnon(this.loadedRater?.id);
  }

  public get isGoodFeedback(): boolean {
    return this.isHelpful || this.isInspiring || this.isConnect;
  }

  constructor(
    private authService: AuthService,
    private transactionsService: TransactionsService,
    private insightsService: InsightsService,
    private newsfeedService: NewsfeedService,
    private conversationsService: ConversationsService,
    private messagesService: MessagesService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.parseRatebacks();
    this.subscribeToRateback();
    this.checkActive();
  }

  parseRatebacks() {
    const rateback = this.insightsService.ratebacks?.[this.feedbackSessionId];
    if (rateback) {
      Object.keys(rateback).forEach((key) => {
        this.ratebacksCount.add(+key);
        this.currentRatebacks[+key] = rateback[key].rateback;
      });
    }
  }

  subscribeToRateback() {
    this.itemDidReceiveRateback$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter((res) =>
          this.feedbacks
            .map((feedback) => feedback.id)
            .includes(res.feedbackId),
        ),
      )
      .subscribe((event: RatebackEvt) => {
        this.currentRatebacks[event.feedbackId] = event.rateback;
        this.ratebacksCount.add(event.feedbackId);
        this.checkActive();
      });
  }

  checkActive() {
    if (this.ratebacksCount.size === this.feedbacks.length) {
      this.fetchData();
    }
  }

  ngOnInit(): void {
    this.currentSliderValue = this.project.inspiringrate;

    this.authService
      .fetchUser(this.raterID)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.raterShareToken = res.sharetoken;

        if (!this.authService.isAnon(res.id)) {
          this.loadedRater = res;
        }
      });
  }

  fetchData() {
    this.ratebacks = {};
    this.ratebacks.discouraging = this.getCurrentRateback(-5);
    this.ratebacks.unhelpful = this.getCurrentRateback(-1);
    this.ratebacks.helpful = this.getCurrentRateback(1);
    this.ratebacks.inspiring = this.getCurrentRateback(5);

    this.calculateRatebacks();
  }

  getCurrentRateback(rate: number): number {
    return Object.values(this.currentRatebacks).filter((item) => item === rate)
      .length;
  }

  calculateRatebacks() {
    const ratebacks = Object.values(this.currentRatebacks);
    const ratebacksSum = ratebacks.reduce((acc, current) => acc + current, 0);

    this.isInspiring = ratebacksSum > 4;
    this.isHelpful = ratebacksSum > 0 && ratebacksSum < 5;
    this.isUnhelpful = ratebacksSum < 1 && ratebacksSum > -5;
    this.isDiscouraging = ratebacksSum < -4;
    this.slide = 2;
    this.isDisconnect = false;
    this.isConnect = false;
    this.isExternal = false;
    this.paymentInProgress = false;

    this.cdRef.detectChanges();
  }

  finishSessionDidClick(canPay: boolean): void {
    this.paymentError = null;
    this.paymentInProgress = true;

    if (canPay && this.isAnon) {
      return this.processNotRegistered();
    }

    if (!canPay || !this.currentSliderValue || this.trustedAdvisor) {
      return this.processWithoutPayment();
    }

    this.processWithPayment();
  }

  private processWithPayment() {
    this.paymentInProgress = true;

    this.transactionsService
      .createPaymentIntentForProjectFeedback(
        this.feedbackSessionId,
        this.currentSliderValue * 100,
      )
      .pipe(
        mergeMap((res) => {
          if (res) {
            this.bankCardPayment = true;
            this.secret = res.client_secret;
            this.paymentId = res.payment_id;

            return of(null);
          }

          return this.insightsService
            .fetchFeedbackSession(this.feedbackSessionId)
            .pipe(
              finalize(() => (this.paymentInProgress = false)),
              mergeMap(() => this.insertRatebacks()),
            );
        }),
        catchError((err) => {
          this.snackBar.open(err.error.error, null, {
            duration: 6000,
          });
          return throwError(err);
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  public updatePaymentStatus(): void {
    this.insightsService
      .updatePaymentStatus(this.paymentId)
      .pipe(
        switchMap(() =>
          this.insightsService.fetchFeedbackSession(this.feedbackSessionId),
        ),
        mergeMap(() => this.insertRatebacks()),
        finalize(() => (this.paymentInProgress = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  public handleTipsActions(percent: number = null, id: number): void {
    this.tipsPaymentProcessing = this.feedbackSessionId === id;

    this._tipsPaymentProcessing$.next({ id, processing: true });

    this.transactionsService
      .sendTipsRequest(percent, TipsTypes.feedbackSession, id)
      .pipe(
        finalize(() =>
          this._paymentProcessing$.next({ id, processing: false }),
        ),
        mergeMap(() =>
          this.insightsService
            .fetchFeedbackSession(this.feedbackSessionId)
            .pipe(tap((res) => (this.tips = res.tip))),
        ),
        mergeMap(() => this.insertRatebacks()),
        catchError((err) => {
          this.paymentCompleted = false;
          this.paymentError = err.error.error;
          return throwError(err);
        }),
        tap(() => (this.tipsPaymentProcessing = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  processNotRegistered() {
    this.insertWithoutPayment()
      .pipe(
        tap(() => {
          this.isErrorRegistered = true;
          this.isInspiring = false;
          this.isHelpful = false;
          this.isUnhelpful = false;
        }),
      )
      .subscribe();
  }

  processWithoutPayment() {
    this.insertWithoutPayment()
      .pipe(tap(() => (this.paymentCompleted = true)))
      .subscribe();
  }

  insertWithoutPayment() {
    return this.insertRatebacks().pipe(
      takeUntil(this.destroyed),
      finalize(() => (this.paymentInProgress = false)),
    );
  }

  private insertRatebacks() {
    const calls = [];
    let messagesCall = of({});

    const ratebacks =
      this.insightsService.ratebacks[this.feedbackSessionId] || {};

    for (const key in ratebacks) {
      if (Object.prototype.hasOwnProperty.call(ratebacks, key)) {
        calls.push(
          this.newsfeedService
            .updateRatebackForFeedback(+key, ratebacks[key].rateback)
            .pipe(catchError(() => of(null))),
        );
      }
    }

    if (Object.values(ratebacks).some((rateback) => rateback.comment)) {
      const feedback = this.feedbacks[0];

      const call = this.conversation
        ? of(this.conversation)
        : this.createFeedbackConversation(feedback);

      messagesCall = call.pipe(
        mergeMap((res) => {
          return from(
            Object.keys(ratebacks).filter((key) => ratebacks[key].comment),
          ).pipe(
            concatMap((key) =>
              this.getDirectQuestionCall(
                +key,
                feedback.artist_id,
                ratebacks[key].comment,
                ratebacks[key].audioMessage,
                res.id,
              ),
            ),
          );
        }),
      );
    }

    return forkJoin([...calls, messagesCall]).pipe(
      mergeMap(() => this.applyFeedbackPaymentApproved()),
      tap(() => delete this.insightsService.ratebacks[this.feedbackSessionId]),
    );
  }

  private createFeedbackConversation(feedback: NewsfeedFeedback) {
    return this.conversationsService.createNewFeedbackChat(
      feedback.rating_id,
      'feedback_chat',
      feedback.project_id,
    );
  }

  getDirectQuestionCall(
    feedbackId: number,
    artistId: number,
    text: string,
    audioMessage: AudioMessage,
    conversationId: number,
  ) {
    const message: Message = {
      conversation_id: conversationId,
      user_id: artistId,
      body: text,
      audio_message: audioMessage,
    };
    message.feedback_id = feedbackId;
    return this.messagesService.createMessage(message);
  }

  didUpdateSlider(newValue: number) {
    this.currentSliderValue = newValue;
  }

  public disconnect() {
    this.isUnhelpful = false;
    this.isDisconnect = true;
  }

  public connect() {
    this.isConnect = true;
    this.isUnhelpful = false;
  }

  disconnectUserFromAdvisor() {
    this.conversationsService
      .disconnectUserFromAdvisor('advisor', this.raterID)
      .subscribe();
    this.finishSessionDidClick(false);
  }

  applyFeedbackPaymentApproved() {
    return this.insightsService
      .markPaidFeedbackSessionAsPaidForRaterAndProject(
        this.raterID,
        this.project.id,
      )
      .pipe(
        tap(() => {
          this.paymentCompleted = true;

          if (this.isErrorRegistered || this.isErrorSetupPayment) {
            this.slide = 3;
            return;
          }

          if (this.isInspiring) {
            this.slide = 3;
            this.isRecommend = true;
          }

          if (this.isHelpful || this.isConnect) {
            this.slide = 3;
            this.isConnected = true;
          }
        }),
        catchError((err) => {
          this.paymentError = err;
          return throwError(err);
        }),
      );
  }
}
