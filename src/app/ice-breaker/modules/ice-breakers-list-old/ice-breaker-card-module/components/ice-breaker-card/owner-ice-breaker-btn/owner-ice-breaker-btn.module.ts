import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerIceBreakerBtnComponent } from './owner-ice-breaker-btn/owner-ice-breaker-btn.component';
import { PipesModule } from '../../../../../../../shared/pipes/pipes.module';
import { PriceControlSliderModule } from '../../../../../../../shared/components/price-control-slider/price-control-slider.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OwnerIceBreakerBtnComponent],
  exports: [OwnerIceBreakerBtnComponent],
  imports: [
    CommonModule,
    PipesModule,
    PriceControlSliderModule,
    FormsModule,
    TranslateModule,
  ],
})
export class OwnerIceBreakerBtnModule {}
