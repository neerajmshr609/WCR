import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceSliderComponent } from './price-slider.component';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PriceSliderComponent],
  imports: [
    CommonModule,
    NouisliderModule,
    FormsModule,
    PipesModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [PriceSliderComponent],
})
export class PriceSliderModule {}
