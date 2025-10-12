import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';
import { StripeDashboardLinks } from 'src/app/shared/models/stripe-dashboard-links';
import { forkJoin, Observable } from 'rxjs';
import {
  mergeMap,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Balance } from 'src/app/shared/models/balance.model';
import { User } from 'src/app/shared/models/user.model';
import { PayoutRequestsService } from 'src/app/services/payout-requests.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { MatDialog } from '@angular/material/dialog';
import { PayoutRequest } from 'src/app/shared/models/payout-request.model';
import { BonusItem, Country, LastTransactions } from '../../interfaces';
import { Bonus, CountriesItems } from '../../constants';
import { Invoice } from 'src/app/shared/models/invoice.model';

@Component({
  selector: 'app-finances-stripe',
  templateUrl: './finances-stripe.component.html',
  styleUrls: ['./finances-stripe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesStripeComponent extends BaseComponent implements OnInit {
  @ViewChild('ConfirmModalTmpl', { read: TemplateRef })
  private readonly confirmModal: TemplateRef<unknown>;

  type: 'paying' | 'getting' | 'save' = 'paying';
  connect: boolean;
  baseUrl?: string;
  stripeClientID?: string;
  public currentUser?: User;
  notSupport: boolean;
  lastTransactions?: LastTransactions[];
  public balance: Balance;
  public advisorPayments;

  srcLink: string = 'xQEoue2nNg4';
  countries: Country[] = CountriesItems;
  saveBonus: BonusItem[] = Bonus;

  stripeDashboardLinks$: Observable<StripeDashboardLinks>;

  lastItemTransactions;
  stripeBalance;

  public reloadNotification: boolean;
  public informText: string;

  public currentPayoutRequest: PayoutRequest;
  public showPayoutBnt: boolean;
  public invoices$: Observable<Invoice[]> =
    this.payoutRequestsService.getInvoicesList();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private transactionsSerivce: TransactionsService,
    private payoutRequestsService: PayoutRequestsService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.stripeDashboardLinks$ =
      this.transactionsSerivce.stripeDashboardLinks$.pipe(shareReplay(1));

    this.getCurrentPayoutRequest();
  }

  deleteStripeAccount() {
    this.transactionsSerivce
      .deleteStripeAccount()
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        window.location.reload();
      });
  }

  payout(): void {
    this.payoutRequestsService
      .payout()
      .pipe(switchMap(() => this.fetchStripeBalance()))
      .subscribe();
  }

  private fetchStripeBalance(): Observable<unknown> {
    return this.transactionsSerivce.fetchStripeBalance().pipe(
      takeUntil(this.destroyed),
      tap((balance) => {
        this.stripeBalance = balance;
        this.changeDetectorRef.detectChanges();
      }),
      mergeMap(() => this.getLastPayouts()),
    );
  }

  getLastPayouts() {
    return forkJoin([
      this.transactionsSerivce.getPayoutsList().pipe(
        tap((data) => {
          this.lastItemTransactions = data;
        }),
      ),
      this.transactionsSerivce.fetchTransactions().pipe(tap((res) => res)),
    ]);
  }

  private getCurrentPayoutRequest(): void {
    if (this.type !== 'getting') return;

    this.payoutRequestsService
      .getCurrentPayoutRequest()
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => {
          // @ts-ignore
          this.currentPayoutRequest = res;
          this.showPayoutBnt =
            !this.currentPayoutRequest ||
            this.currentPayoutRequest.status === 'success';
        }),
      )
      .subscribe();
  }

  onDeleteStripe(): void {
    this.deleteStripeAccount();
  }

  onPayout(): void {
    const confirmModalRef = this.matDialog.open(this.confirmModal);
    confirmModalRef
      .afterClosed()
      .pipe(
        tap((accept: boolean) => {
          if (accept) {
            this.payout();
          }
        }),
      )
      .subscribe();
  }
}
