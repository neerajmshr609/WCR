import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from './receipt.component';
import { PipesModule } from '../../pipes/pipes.module';
import { SmallSpinnerModule } from '../small-spinner/small-spinner.module';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [ReceiptComponent],
  imports: [CommonModule, PipesModule, SmallSpinnerModule, MomentModule],
  exports: [ReceiptComponent],
})
export class ReceiptModule {}
