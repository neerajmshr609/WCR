import { NgModule } from '@angular/core';
import { PaymentCounterComponent } from './payment-counter.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PaymentCounterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MatButtonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  exports: [PaymentCounterComponent],
})
export class PaymentCounterModule {}
