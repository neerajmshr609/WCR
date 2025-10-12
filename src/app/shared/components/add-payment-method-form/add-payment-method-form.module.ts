import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPaymentMethodFormComponent } from './add-payment-method-form.component';
import { SmallSpinnerModule } from '../small-spinner/small-spinner.module';

@NgModule({
  declarations: [AddPaymentMethodFormComponent],
  exports: [AddPaymentMethodFormComponent],
  imports: [CommonModule, SmallSpinnerModule],
})
export class AddPaymentMethodFormModule {}
