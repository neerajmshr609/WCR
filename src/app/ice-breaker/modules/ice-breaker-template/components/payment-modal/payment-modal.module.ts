import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentModalComponent } from './payment-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddPaymentMethodFormModule } from 'src/app/shared/components/add-payment-method-form/add-payment-method-form.module';
import { ReceiptModule } from 'src/app/shared/components/receipt/receipt.module';

@NgModule({
  declarations: [PaymentModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    AddPaymentMethodFormModule,
    ReceiptModule,
  ],
})
export class PaymentModalModule {}
