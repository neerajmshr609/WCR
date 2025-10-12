import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  takeUntil,
  switchMap,
  finalize,
  tap,
  mergeMap,
  catchError,
} from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Project } from 'src/app/shared/models/project.model';
import { InsightsService } from 'src/app/services/insights.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { FeedbackSession } from 'src/app/shared/models/feedback-session';
import { PaymentSessionStatuses } from 'src/app/shared/enums';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trusted-advisor-payment',
  templateUrl: './trusted-advisor-payment.component.html',
  styleUrls: ['./trusted-advisor-payment.component.scss'],
})
export class TrustedAdvisorPaymentComponent
  extends BaseComponent
  implements OnInit
{
  @Input() raterId: number;
  @Input() project: Project;
  @Input() feedbackSession: FeedbackSession;
  @Input() link: string;

  @Output() paid = new EventEmitter<void>();
  @Output() feedbackSessionChange = new EventEmitter<FeedbackSession>();

  paymentSessionStatuses = PaymentSessionStatuses;

  paymentInProgress: boolean;
  private paymentId: string;

  bankCardPayment: boolean;
  secret: string;

  constructor(
    private transactionsService: TransactionsService,
    private insightsService: InsightsService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {}

  public pay() {
    this.paymentInProgress = true;

    this.transactionsService
      .createPaymentIntentForProjectFeedback(this.feedbackSession.id)
      .pipe(
        mergeMap((res) => {
          if (res) {
            this.bankCardPayment = true;
            this.secret = res.client_secret;
            this.paymentId = res.payment_id;

            return of(null);
          }

          return this.insightsService
            .fetchFeedbackSession(this.feedbackSession.id)
            .pipe(
              tap((session) => this.feedbackSessionChange.emit(session)),
              finalize(() => (this.paymentInProgress = false)),
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
          this.insightsService.fetchFeedbackSession(this.feedbackSession.id),
        ),
        tap((res) => (this.feedbackSession = res)),
        finalize(() => (this.paymentInProgress = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }
}
