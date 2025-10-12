import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PaymentSliderComponent } from './payment-slider.component';

@NgModule({
  declarations: [PaymentSliderComponent],
  imports: [CommonModule, NgxSliderModule],
  exports: [PaymentSliderComponent],
})
export class PaymentSliderModule {}
