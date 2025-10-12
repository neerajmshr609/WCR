import { effect, NgModule } from '@angular/core';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { AboutCardComponent } from './about-card/about-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';

@NgModule({
  declarations: [AboutComponent, AboutCardComponent],
  imports: [
    SharedModule,
    AboutRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('about')),
  ],
})
export class AboutModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
