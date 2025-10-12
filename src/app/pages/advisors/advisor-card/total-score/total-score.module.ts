import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalScoreComponent } from './total-score.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DirectivesModule } from '../../../../shared/directives/directives.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { LanguageService } from '../../../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../../../shared/app-language/translate-module-provider-config.factory';

@NgModule({
  declarations: [TotalScoreComponent],
  exports: [TotalScoreComponent],
  imports: [
    CommonModule,
    OverlayModule,
    DirectivesModule,
    PipesModule,
    TranslateModule.forChild(createForChildProviderConfig('profile')),
  ],
})
export class TotalScoreModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
