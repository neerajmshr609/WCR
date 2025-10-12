import { effect, NgModule } from '@angular/core';
import { WhyRoutingModule } from './why-routing.module';
import { WhycardComponent } from './whycard/whycard.component';
import { WhyComponent } from './why.component';
import { BrilliantAnimationComponent } from './brilliant-animation/brilliant-animation.component';
import { WelcomeAnimation2Component } from './welcome-animation-2/welcome-animation-2.component';
import { WelcomeAnimation3Component } from './welcome-animation-3/welcome-animation-3.component';
import { MazeAnimationComponent } from './maze-animation/maze-animation.component';
import { UploadCardComponent } from './upload-card/upload-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeTitleComponent } from './home-title/home-title.component';
import { StepCardComponent } from './step-card/step-card.component';
import { SubtitleCardComponent } from './subtitle-card/subtitle-card.component';
import { LanguageService } from '../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';
import { IconHandsComponent } from '../../shared/icons/icon-hands/icon-hands.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { HeartIconComponent } from '../../shared/icons/heart-icon/heart-icon.component';
import { IconShakeHandsComponent } from '../../shared/icons/icon-shake-hands/icon-shake-hands.component';
import { IconHandsPeopleEarthComponent } from '../../shared/icons/icon-hands-people-earth/icon-hands-people-earth.component';
import { StringTyperComponent } from '../../shared/complex-ui-components/string-typer/string-typer.component';

@NgModule({
  declarations: [
    WhycardComponent,
    WhyComponent,
    // WelcomeAnimationComponent,
    BrilliantAnimationComponent,
    WelcomeAnimation2Component,
    WelcomeAnimation3Component,
    MazeAnimationComponent,
    UploadCardComponent,
    HomeTitleComponent,
    StepCardComponent,
    SubtitleCardComponent,
  ],
  imports: [
    SharedModule,
    WhyRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('home')),
    MainContentMenuModule,
    IconHandsComponent,
    ButtonComponent,
    HeartIconComponent,
    IconShakeHandsComponent,
    IconHandsPeopleEarthComponent,
    StringTyperComponent,
  ],
})
export class WhyModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
