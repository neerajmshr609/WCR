import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  input,
} from '@angular/core';
import { LastTransactions } from '../../interfaces';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Balance } from 'src/app/shared/models/balance.model';
import { environment } from 'src/environments/environment';
import { AdvisorPaymentsService } from 'src/app/services/advisor-payments.service';
import {
  filter,
  finalize,
  forkJoin,
  mergeMap,
  Observable,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { TransactionsService } from 'src/app/services/transactions.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';
import { PayoutRequestsService } from 'src/app/services/payout-requests.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
})
export class FinanceComponent extends BaseComponent implements AfterViewInit {
  currentUser = input<User>();

  public studentCardConnected: boolean;
  stripeClientID: string;
  stripeACCLoading = false;
  stripeBalance: Balance;
  notSupport: boolean;
  baseUrl = environment.baseUrl;

  payoutScheduleInterval: string;
  payoutSchedule: string;
  lastItemTransactions: LastTransactions[];
  stripe: Stripe;
  public advisorPayments;

  constructor(
    private transactionsService: TransactionsService,
    private advisorPaymentsService: AdvisorPaymentsService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private readonly payoutService: PayoutRequestsService,
  ) {
    super();
  }

  ngAfterViewInit() {
    loadStripe(environment.stripe.pk).then((res) => (this.stripe = res));

    this.stripeClientID = environment.stripe.clientId;

    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        take(1),
        mergeMap(() => {
          this.stripeACCLoading = true;
          this.changeDetectorRef.detectChanges();

          const calls = [
            this.fetchStripeBalance(),
            this.fetchPaymentMethods(),
            this.fetchStripeDashboardLink(),
            this.getAdvisorPayments(),
          ];

          if (this.currentUser().stripe_user_id) {
            calls.push(this.fetchConnectedAccount());
          }

          return forkJoin(calls).pipe(
            finalize(() => (this.stripeACCLoading = false)),
          );
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  private fetchStripeBalance(): Observable<unknown> {
    return this.transactionsService.fetchStripeBalance().pipe(
      takeUntil(this.destroyed),
      tap((balance) => {
        this.stripeBalance = balance;
        this.changeDetectorRef.detectChanges();
      }),
      mergeMap(() => this.getLastPayouts()),
    );
  }

  fetchConnectedAccount() {
    return this.transactionsService.fetchConnectedAccount().pipe(
      takeUntil(this.destroyed),
      tap((res) => {
        this.payoutScheduleInterval = res.settings.payouts.schedule.interval;
        this.payoutSchedule = res.settings.payouts.schedule.delay_days;
      }),
    );
  }

  private fetchStripeDashboardLink() {
    return this.transactionsService.fetchStripeDashboardLink();
  }

  private fetchPaymentMethods() {
    return this.transactionsService
      .fetchPaymentMethods()
      .pipe(tap((res) => (this.studentCardConnected = !!res.data.length)));
  }

  private getAdvisorPayments() {
    return this.advisorPaymentsService
      .getAdvisorPayments()
      .pipe(tap((res) => (this.advisorPayments = res)));
  }

  onDeleteStripeAccount() {
    this.transactionsService
      .deleteStripeAccount()
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        window.location.reload();
      });
  }

  payoutMoney(): void {
    this.payoutService
      .payout()
      .pipe(switchMap(() => this.fetchStripeBalance()))
      .subscribe();
  }

  getLastPayouts() {
    return forkJoin([
      this.transactionsService.getPayoutsList().pipe(
        tap((data) => {
          this.lastItemTransactions = data;
        }),
      ),
      this.transactionsService.fetchTransactions().pipe(tap((res) => res)),
    ]);
  }

  onNotSupport(): void {
    this.notSupport = !this.notSupport;
  }
}
