import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, timer, Observable, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingModalComponent } from '../onboarding-modal/onboarding-modal.component';
import { BaseComponent } from '../base.component';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { Decimal } from 'decimal.js';
import { UntypedFormControl } from '@angular/forms';
import { PaymentSession } from '../../models/payment-session';
import { PaymentRequestBySeconds } from '../../models/payment-request';
import { WebsocketService } from 'src/app/services/websocket.service';
import { RateflowService } from 'src/app/services/rateflow.service';

const GREYT_PERCENT = 30;
const STRIPE_PERCENT = 2.9;
const STRIPE_TAX = 0.3;

@Component({
  selector: 'app-payment-counter',
  templateUrl: './payment-counter.component.html',
  styleUrls: ['./payment-counter.component.scss'],
})
export class PaymentCounterComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @Input() user: User;
  @Input() conversationDidSend$: BehaviorSubject<boolean>;
  @Input() meetingInProgress$ = new Observable<boolean>();
  @Input() meetingStartTimer$ = new Observable<boolean>();
  @Input() isMeeting = false;
  @Input() isFeedback = false;
  @Input() hourlyRate: number;
  @Input() conversationId: number;
  @Input() advisorId: number;
  @Input() closeTimer$ = new Observable<boolean>();
  @Input() currentPaymentSession: PaymentSession;
  @Input() isOwnerOfIceBreaker = false;
  @Input() set informMessage(value: string) {
    if (value) {
      this.infoMessage = value;
      return;
    }
    this.infoMessage = 'To start charging for your time spent press play.';
  }

  @Output() didUpdate = new EventEmitter<PaymentRequestBySeconds>();
  @Output() toggleTimer = new EventEmitter<boolean>();
  @Output() createPaymentSession = new EventEmitter();
  @Output() closePaymentSession = new EventEmitter<PaymentSession>();
  @Output() changeBillableSeconds = new EventEmitter<number>();
  @Output() isActiveSession: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  readonly rippleColor = '#00C67E';
  infoMessage = 'To start charging for your time spent press play.';

  isRecording = false;
  earnings = 0;
  isActive = false;
  timerCanBeStarted = false;
  displayTime = 0;
  lastMessageSeconds = 0;

  paymentSessionStarted: boolean;

  timer$: Observable<number>;
  timerSub: Subscription;

  timeControl: UntypedFormControl;

  meetingInProgress: boolean;

  public get extraMoney(): number {
    return (
      new Decimal(this.earnings)
        .div(100)
        .mul(GREYT_PERCENT + STRIPE_PERCENT)
        .toNumber() + STRIPE_TAX
    );
  }

  constructor(
    private websocketService: WebsocketService,
    private rateflowService: RateflowService,
    private dialog: MatDialog,
  ) {
    super();
  }

  private getEarnings(seconds: number): number {
    const earnings = new Decimal(seconds)
      .mul(new Decimal(this.hourlyRate).div(3600))
      .toNumber();
    return earnings;
  }

  startTimer(): void {
    // if (!this.user.stripe_user_id) {
    //   this.dialog.open(OnboardingModalComponent, {
    //     maxWidth: '92vw',
    //     width: '360px',
    //     maxHeight: '92vh',
    //     height: '640px',
    //     autoFocus: false,
    //     panelClass: 'modal',
    //     data: { step: 6 }
    //   });

    //   return;
    // }

    this.toggleTimer.emit(true);

    if (!this.currentPaymentSession?.id) {
      this.createPaymentSession.emit();
    }

    if (!this.timer$) {
      this.earnings = 0;
      this.lastMessageSeconds = 0;
      this.displayTime =
        this.currentPaymentSession?.payment_request?.due_seconds || 0;
      this.timer$ = timer(0, 1000);
    }

    this.timerSub = this.timer$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.updateTimer();
      });

    this.isActive = true;
    this.isActiveSession.emit(this.isActive);
    this.isRecording = true;
  }

  pauseTimer(): void {
    this.timerSub.unsubscribe();
    this.isRecording = false;

    this.toggleTimer.emit(false);
  }

  resetTimer(): void {
    if (this.timer$) {
      this.timerSub.unsubscribe();
      this.timer$ = null;

      this.displayTime = 0;
      this.earnings = 0;

      this.isRecording = false;
      this.isActive = false;
      this.isActiveSession.emit(this.isActive);
      this.paymentSessionStarted = false;
    }
  }

  onConfirmClick(): void {
    if (this.isRecording) {
      this.pauseTimer();
      return;
    }

    this.closePaymentSession.emit();
  }

  private updateTimer() {
    this.displayTime++;
    this.lastMessageSeconds++;
    this.earnings = this.getEarnings(this.displayTime);
    this.timeControl.setValue(
      new Date(this.displayTime * 1000).toISOString().substr(11, 8),
      { emitEvent: false },
    );

    const paymentRequest = new PaymentRequestBySeconds();
    let time;

    if (this.isMeeting) {
      this.websocketService.sendMeetingCounter(
        this.conversationId,
        true,
        this.displayTime,
      );
      time = this.displayTime;
    } else {
      time = this.lastMessageSeconds;
    }

    paymentRequest.advisor_income = this.earnings;
    paymentRequest.due_seconds = time;

    this.didUpdate.emit(paymentRequest);
  }

  ngOnInit(): void {
    this.meetingInProgress$.pipe(takeUntil(this.destroyed)).subscribe((res) => {
      this.isActive = res;
      this.isActiveSession.emit(res);
      this.meetingInProgress = res;
    });

    this.websocketService.subscribeMeetingCounter(this.conversationId);

    this.conversationDidSend$
      ?.pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
      )
      .subscribe(() => (this.lastMessageSeconds = 0));

    this.timeControl = new UntypedFormControl('00:00:00');
    this.timeControl.valueChanges
      .pipe(takeUntil(this.destroyed), distinctUntilChanged())
      .subscribe((res) => {
        const time = res.split(':');
        const hours = +time[0];
        const minutes = +time[1];
        const seconds = +time[2];

        this.displayTime =
          (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
        this.earnings = this.getEarnings(this.displayTime);

        if (this.currentPaymentSession) {
          const paymentSessionRequest = new PaymentRequestBySeconds();
          paymentSessionRequest.billable_seconds = this.displayTime;
          this.currentPaymentSession.payment_request = paymentSessionRequest;
        } else {
          this.changeBillableSeconds.emit(this.displayTime);
        }
      });

    if (this.currentPaymentSession) {
      this.startTimer();
      this.pauseTimer();
      this.paymentSessionStarted = true;

      const paymentRequest = this.currentPaymentSession.payment_request;
      const seconds =
        paymentRequest.billable_seconds || paymentRequest.due_seconds;
      this.displayTime = seconds;
      this.timeControl.setValue(
        new Date(seconds * 1000).toISOString().substr(11, 8),
        { emitEvent: false },
      );
    }

    this.closeTimer$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !res),
      )
      .subscribe(() => this.resetTimer());

    if (this.advisorId !== this.user.id) {
      this.websocketService.meetCounter$
        .pipe(
          takeUntil(this.destroyed),
          filter((res) => !!res?.seconds),
        )
        .subscribe((res) => {
          this.displayTime = res.seconds;
          this.earnings = new Decimal(this.displayTime)
            .mul(this.hourlyRate)
            .div(3600)
            .toNumber();

          const paymentRequest = new PaymentRequestBySeconds();
          paymentRequest.advisor_income = this.earnings;
          paymentRequest.due_seconds = this.displayTime;

          this.didUpdate.emit(paymentRequest);
        });
    } else {
      this.meetingStartTimer$
        .pipe(takeUntil(this.destroyed))
        .subscribe((res) => {
          if (res) {
            this.timerCanBeStarted = true;
            return;
          }

          this.timerCanBeStarted = false;

          if (!this.meetingInProgress) {
            this.resetTimer();
          } else {
            this.pauseTimer();
          }
        });
    }

    this.rateflowService.draftTimerParsed$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res) => {
          this.startTimer();
          this.pauseTimer();
          this.displayTime = res - 1;
          setTimeout(() => this.updateTimer());
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.timer$) {
      this.timerSub.unsubscribe();
      this.timer$ = null;
    }
  }
}
