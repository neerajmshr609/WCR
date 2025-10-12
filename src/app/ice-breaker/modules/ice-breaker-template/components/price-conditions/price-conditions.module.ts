import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceConditionsComponent } from './price-conditions/price-conditions.component';
import { PropertyCounterComponent } from './price-conditions/components/property-counter/property-counter.component';
import { FormsModule } from '@angular/forms';
import { PriceSliderModule } from 'src/app/pages/conversation/price-slider/price-slider.module';
import { PriceControlSliderModule } from 'src/app/shared/components/price-control-slider/price-control-slider.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [PriceConditionsComponent, PropertyCounterComponent],
  exports: [PriceConditionsComponent],
  imports: [
    CommonModule,
    PipesModule,
    PriceControlSliderModule,
    FormsModule,
    PriceSliderModule,
  ],
})
export class PriceConditionsModule {}
