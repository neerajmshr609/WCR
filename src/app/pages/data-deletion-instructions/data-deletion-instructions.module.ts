// src/app/pages/data-deletion-instructions/data-deletion-instructions.module.ts

import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DataDeletionInstructionsRoutingModule } from './data-deletion-instructions-routing.module';
import { DataDeletionInstructionsComponent } from './data-deletion-instructions.component';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';

@NgModule({
  declarations: [DataDeletionInstructionsComponent],
  imports: [
    CommonModule,
    DataDeletionInstructionsRoutingModule,
    TranslateModule.forChild(
      createForChildProviderConfig('data-deletion-instructions'),
    ),
  ],
})
export class DataDeletionInstructionsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
