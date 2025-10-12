import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SliderComponent],
  imports: [CommonModule, NouisliderModule, FormsModule],
  exports: [SliderComponent],
})
export class SliderModule {}
