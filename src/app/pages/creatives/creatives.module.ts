import { effect, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreativesRoutingModule } from './creatives-routing.module';
import { CreativesComponent } from './layout/creatives.component';
import { CreativesProjectCardComponent } from './creatives-project-card/creatives-project-card.component';
import { CreativesInfoCardComponent } from './creatives-info-card/creatives-info-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreativesWarningModalComponent } from './creatives-warning-modal/creatives-warning-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';

@NgModule({
  declarations: [
    CreativesComponent,
    CreativesProjectCardComponent,
    CreativesInfoCardComponent,
    CreativesWarningModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreativesRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('creatives')),
    MainContentMenuModule,
  ],
})
export class CreativesModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
