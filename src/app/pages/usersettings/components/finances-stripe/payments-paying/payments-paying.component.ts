import {
  Component,
  input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Balance } from '@stripe/stripe-js';
import { Observable, shareReplay } from 'rxjs';
import { PayoutRequestsService } from 'src/app/services/payout-requests.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Invoice } from 'src/app/shared/models/invoice.model';
import { StripeDashboardLinks } from 'src/app/shared/models/stripe-dashboard-links';

@Component({
  selector: 'app-payments-paying',
  templateUrl: './payments-paying.component.html',
  styleUrls: ['./payments-paying.component.scss'],
})
export class PaymentsPayingComponent implements OnInit, OnChanges {
  connect = input<boolean>();
  type = input<string>();
  public reloadNotification: boolean;
  balance = input<Balance>();

  public invoices: Invoice[] = [];

  informText: string;
  stripeDashboardLinks: StripeDashboardLinks;

  constructor(
    private payoutRequestsService: PayoutRequestsService,
    private transactionsSerivce: TransactionsService,
  ) {}

  ngOnInit() {
    this.transactionsSerivce.stripeDashboardLinks$
      .pipe(shareReplay(1))
      .subscribe((res) => (this.stripeDashboardLinks = res));

    this.payoutRequestsService
      .getInvoicesList()
      .subscribe((res) => (this.invoices = res));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.connect &&
      changes.connect.currentValue !== changes.connect.previousValue
    ) {
      this.getInformText();
    }
  }

  getInformText() {
    const getText = () => {
      if (this.connect) {
        if (this.type() === 'paying') return 'finances_stripe.connect_paying';
        if (this.type() === 'getting') return 'finances_stripe.getting';
      }

      if (this.type() === 'paying') return 'finances_stripe.paying';
      if (this.type() === 'getting') return ``;
    };

    this.informText = getText();
  }
}
