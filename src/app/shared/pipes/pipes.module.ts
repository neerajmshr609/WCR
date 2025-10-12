import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CardFilterPipe } from './card-filter.pipe';
import { CurrenciesPipe } from './currency.pipe';
import { DateMomentPipe } from './date-moment.pipe';
import { EuroCurrencyPipe } from './euro-currency.pipe';
import { GreytDatePipe } from './greyt-date.pipe';
import { HmsPipe } from './hms.pipe';
import { ProjectScorePipe } from './project-score.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    CurrenciesPipe,
    DateMomentPipe,
    EuroCurrencyPipe,
    SafePipe,
    ProjectScorePipe,
    HmsPipe,
    GreytDatePipe,
    CardFilterPipe,
  ],
  imports: [],
  exports: [
    CurrenciesPipe,
    DateMomentPipe,
    EuroCurrencyPipe,
    SafePipe,
    ProjectScorePipe,
    HmsPipe,
    GreytDatePipe,
    CardFilterPipe,
  ],
  providers: [CurrencyPipe],
})
export class PipesModule {}
