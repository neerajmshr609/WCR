import { effect, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsfeedComponent } from './newsfeed.component';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';
import { TypingCardComponent } from '../../shared/components/typing-card/typing-card.component';

@NgModule({
  declarations: [NewsfeedComponent, WelcomeCardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: NewsfeedComponent }]),
    TranslateModule.forChild(createForChildProviderConfig('publicfeed')),
    MainContentMenuModule,
    TypingCardComponent,
  ],
  exports: [NewsfeedComponent, WelcomeCardComponent],
})
export class NewsfeedModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
