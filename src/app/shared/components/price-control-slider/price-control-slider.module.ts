import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceControlSliderComponent } from './price-control-slider/price-control-slider.component';
import { MatIconModule } from '@angular/material/icon';
import { NouisliderModule } from 'ng2-nouislider';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PriceControlSliderComponent],
  exports: [PriceControlSliderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    NouisliderModule,
    PipesModule,
    FormsModule,
  ],
})
export class PriceControlSliderModule {}
