import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipsComponent } from './tips.component';
import { SmallSpinnerModule } from '../small-spinner/small-spinner.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TipsComponent],
  imports: [CommonModule, MatButtonModule, SmallSpinnerModule],
  exports: [TipsComponent],
})
export class TipsModule {}
