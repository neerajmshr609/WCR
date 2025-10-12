import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmallSpinnerComponent } from './small-spinner.component';

@NgModule({
  declarations: [SmallSpinnerComponent],
  imports: [CommonModule],
  exports: [SmallSpinnerComponent],
})
export class SmallSpinnerModule {}
