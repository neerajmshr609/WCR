import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IceBreakerRoutingModule } from './routing/ice-breaker-routing.module';
import { IconIceBreakerComponent } from '../shared/icons/icon-ice-breaker/icon-ice-breaker.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../services/language.service';

@NgModule({
  imports: [
    CommonModule,
    IceBreakerRoutingModule,
    IconIceBreakerComponent,
    TranslateModule.forChild(createForChildProviderConfig('ice-breakers')),
  ],
})
export class IceBreakerModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
