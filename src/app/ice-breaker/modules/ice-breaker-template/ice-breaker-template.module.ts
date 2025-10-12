import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IceBreakerTemplateRoutingModule } from './ice-breaker-template-routing.module';
import { IceBreakerTemplateComponent } from './pages/ice-breaker-template/ice-breaker-template.component';
import { ConversationMessageModule } from './components/converstation-message/conversation-message.module';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { IsUserQuestionExistPipe } from './pipes/is-user-question-exist.pipe';
import { PriceConditionsModule } from './components/price-conditions/price-conditions.module';
import { PaymentModalModule } from './components/payment-modal/payment-modal.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShareProfileCarouselModule } from 'src/app/shared/components/share-profile-modal/components/share-profile-carousel/share-profile-carousel.module';
import { ScrollBtnModule } from 'src/app/shared/components/scroll-btn/scroll-btn.module';
import { createForChildProviderConfig } from 'src/app/shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from 'src/app/services/language.service';

@NgModule({
  declarations: [
    IceBreakerTemplateComponent,
    ScrollToBottomDirective,
    IsUserQuestionExistPipe,
  ],
  imports: [
    CommonModule,
    IceBreakerTemplateRoutingModule,
    SharedModule,
    ConversationMessageModule,
    ShareProfileCarouselModule,
    ScrollBtnModule,
    PriceConditionsModule,
    PaymentModalModule,
    TranslateModule.forChild(createForChildProviderConfig('ice-breakers')),
  ],
  exports: [ScrollToBottomDirective],
})
export class IceBreakerTemplateModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
