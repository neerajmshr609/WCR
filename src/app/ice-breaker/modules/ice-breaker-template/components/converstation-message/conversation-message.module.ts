import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationMessageComponent } from './conversation-message.component';
import { MomentModule } from 'ngx-moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IframelyEmbedModule } from 'src/app/ice-breaker/modules/ice-breakers-list-old/ice-breaker-card-module/components/iframely-embed/iframely-embed.module';
import { LanguageService } from 'src/app/services/language.service';
import { createForChildProviderConfig } from 'src/app/shared/app-language/translate-module-provider-config.factory';
import { ReceiptModule } from 'src/app/shared/components/receipt/receipt.module';
import { UserAvatarModule } from 'src/app/shared/components/user-info/pipes/user-avatar/user-avatar.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ConversationMessageComponent],
  exports: [ConversationMessageComponent],
  imports: [
    CommonModule,
    PipesModule,
    SharedModule,
    MomentModule,
    IframelyEmbedModule,
    UserAvatarModule,
    ReceiptModule,
    TranslateModule.forChild(createForChildProviderConfig('ice-breakers')),
  ],
})
export class ConversationMessageModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
