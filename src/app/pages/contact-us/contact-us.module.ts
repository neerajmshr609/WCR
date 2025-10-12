import { effect, NgModule } from '@angular/core';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    SharedModule,
    ContactUsRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('contact')),
  ],
})
export class ContactUsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
