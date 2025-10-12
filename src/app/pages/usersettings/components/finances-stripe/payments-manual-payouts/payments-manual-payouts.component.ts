import { Component, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PayoutRequestModalComponent } from '../payout-request-modal/payout-request-modal.component';
import { tap } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-payments-manual-payouts',
  templateUrl: './payments-manual-payouts.component.html',
  styleUrls: ['./payments-manual-payouts.component.scss'],
})
export class PaymentsManualPayoutsComponent {
  connect = input<boolean>();
  currentUser = input<User>();
  showPayoutBnt = input();
  advisorPayments = input();
  currentPayoutRequest = input();

  constructor(private matDialog: MatDialog) {}

  public requestPayout() {
    const dialog = this.matDialog.open(PayoutRequestModalComponent, {
      width: '362px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'reduced-padding-20',
      data: {
        // amount: this.advisorPayments()?.balance,
      },
    });

    const subscription = dialog
      .afterClosed()
      .pipe(
        tap((res) => {
          if (res) this.currentPayoutRequest = res;

          subscription.unsubscribe();
        }),
      )
      .subscribe();
  }

  public deleteRequest() {
    this.currentPayoutRequest = null;
  }
}
