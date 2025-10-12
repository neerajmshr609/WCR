import { effect, NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ConversationModule } from '../conversation/conversation.module';
import { NewChatComponent } from './new-chat.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';

@NgModule({
  declarations: [NewChatComponent],
  imports: [
    ConversationModule,
    SharedModule,
    TranslateModule.forChild(createForChildProviderConfig('conversation')),
  ],
  exports: [NewChatComponent],
})
export class NewChatModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
