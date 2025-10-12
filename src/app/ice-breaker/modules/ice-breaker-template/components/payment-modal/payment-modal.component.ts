import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PriceConditionsResult } from '../../ice-breaker-template-messages';
import { AuthService } from 'src/app/auth/auth.service';
import { IceBreakerService } from 'src/app/ice-breaker/service/ice-breaker.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { BasePaymentRequest } from 'src/app/shared/models/payment-request';
import { PaymentMethods } from 'src/app/shared/models/transaction.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  paymentMethods!: PaymentMethods;
  currentUser$: Observable<User> = this.authService.userSubject$;
  paymentRequestInvoice$!: Observable<BasePaymentRequest>;
  isShowCardForm = false;

  constructor(
    private readonly transactionService: TransactionsService,
    private readonly iceBreakerService: IceBreakerService,
    private readonly authService: AuthService,
    private readonly dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: PriceConditionsResult,
  ) {
    super();
  }

  ngOnInit(): void {
    this.paymentRequestInvoice$ =
      this.iceBreakerService.getIceBreakerInvoiceInfo(
        this.data.price,
        this.data.countOfPeople,
      );
    this.checkPaymentMethods();
  }

  attachPaymentMethods(id: string): void {
    this.transactionService
      .attachPaymentMethod(id)
      .pipe(
        tap(() => this.checkPaymentMethods()),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  private checkPaymentMethods(): void {
    this.transactionService
      .fetchPaymentMethods()
      .pipe(
        tap((res: PaymentMethods) => {
          this.paymentMethods = { ...res };
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  close(paymentRequest?: BasePaymentRequest): void {
    if (!paymentRequest) {
      this.dialogRef.close(undefined);
      return;
    }
    this.dialogRef.close({ ...paymentRequest, ...this.data });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
