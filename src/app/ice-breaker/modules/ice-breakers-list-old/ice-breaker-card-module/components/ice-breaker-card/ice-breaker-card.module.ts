import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IceBreakerCardComponent } from './ice-breaker-card.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../../../../../shared/shared.module';
import { TotalScoreModule } from '../../../../../../pages/advisors/advisor-card/total-score/total-score.module';
import { InformModalComponent } from './inform-modal/inform-modal.component';
import { PriceSliderModule } from '../../../../../../pages/conversation/price-slider/price-slider.module';
import { IframelyEmbedModule } from '../iframely-embed/iframely-embed.module';
import { GetIframeModule } from './pipes/get-iframe/get-iframe.module';
import { OwnerIceBreakerBtnModule } from './owner-ice-breaker-btn/owner-ice-breaker-btn.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from '../../../../../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../../../../../shared/app-language/translate-module-provider-config.factory';

@NgModule({
  declarations: [IceBreakerCardComponent, InformModalComponent],
  exports: [IceBreakerCardComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SharedModule,
    TotalScoreModule,
    PriceSliderModule,
    IframelyEmbedModule,
    GetIframeModule,
    OwnerIceBreakerBtnModule,
    TranslateModule.forChild(createForChildProviderConfig('profile')),
  ],
})
export class IceBreakerCardModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
