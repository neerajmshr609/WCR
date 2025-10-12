import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounsellorDeskComponent } from './counsellor-desk/counsellor-desk.component';
import { CounsellorDeskRoutingModule } from './counsellor-desk-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from 'src/app/shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from 'src/app/services/language.service';
import { FilterService } from './service/filter.service';
import { ExpertiseCardComponent } from '../../shared/model-based-components/skill/expertise-card/expertise-card.component';
import { TypingCardComponent } from '../../shared/components/typing-card/typing-card.component';

@NgModule({
  declarations: [CounsellorDeskComponent],
  imports: [
    CommonModule,
    CounsellorDeskRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('counsellor-desk')),
    ExpertiseCardComponent,
    TypingCardComponent,
  ],
  providers: [FilterService],
  exports: [CounsellorDeskComponent],
})
export class CounsellorDeskModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
