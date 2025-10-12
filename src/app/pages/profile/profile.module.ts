import { effect, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './components/_profile/profile.component';
import { BecomeAdvisorModalComponent } from './rudimentary/become-advisor-modal/become-advisor-modal.component';
import { ShareProfileModalModule } from '../../shared/components/share-profile-modal/share-profile-modal.module';
import { LanguageService } from '../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { ProfileRoutingModule } from './routing/profile-routing.module';
import { IconSpinnerComponent } from '../../shared/icons/icon-spinner/icon-spinner.component';
import { CoverImageComponent } from '../../shared/UIkit/cover-image/cover-image.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { UploadIconComponent } from '../../shared/icons/upload-icon/upload-icon.component';
import { ProfileInfoCardTitleComponent } from './components/profile-info/profile-info-card-title/profile-info-card-title.component';
import { ProfileInfoCardComponent } from './components/profile-info/_profile-info-card/profile-info-card.component';
import { ConversationImageComponent } from '../../shared/model-based-components/conversation-image/conversation-image.component';
import { UserIconComponent } from '../../shared/icons/user-icon/user-icon.component';
import { IsOnlineComponent } from '../../shared/complex-ui-components/is-online/is-online.component';
import { HorizontalLineComponent } from '../../shared/UIkit/horizontal-line/horizontal-line.component';
import { RoleDescriptionComponent } from './components/profile-info/role-description/role-description.component';
import { TextareaComponent } from '../../shared/UIkit/textarea/textarea.component';
import { InputTextareaComponent } from '../../shared/UIkit/inputs/input-textarea/input-textarea.component';
import { ButtonEditComponent } from '../../shared/UIkit/buttons/button-edit/button-edit.component';
import { ButtonSaveComponent } from '../../shared/UIkit/buttons/button-save/button-save.component';
import { ValidationErrorsComponent } from '../../shared/UIkit/inputs/validation-errors/validation-errors.component';
import { RecommendOrShareProfileComponent } from './components/profile-info/recomend-or-share-profile/recommend-or-share-profile.component';
import { IconRecommendedComponent } from '../../shared/icons/icon-recommended/icon-recommended.component';
import { ShareIconComponent } from '../../shared/icons/share-icon/share-icon.component';
import { IconShareSecondComponent } from '../../shared/icons/icon-share-second/icon-share-second.component';
import { StatsComponent } from './components/profile-info/stats/stats.component';
import { ProfileTopicsExpertiseComponent } from './components/profile-info/profile-topics-expertise/profile-topics-expertise.component';
import { SegmentTitleComponent } from './components/profile-info/segment-title/segment-title.component';
import { SkillsButtonListComponent } from '../../shared/model-based-components/skill/skills-button-list/skills-button-list.component';
import { ProfileInfoLanguagesComponent } from './components/profile-info/profile-info-languages/profile-info-languages.component';
import { ButtonChipComponent } from '../../shared/UIkit/buttons/button-chip/button-chip.component';
import { EmailNotificationsComponent } from './components/profile-info/email-notifications/email-notifications.component';
import { InputSwitchCheckboxLabeledComponent } from '../../shared/complex-ui-components/labeled-inputs/input-switch-checkbox-labeled/input-switch-checkbox-labeled.component';
import { ProfileNavigationComponent } from './components/profile-navigation/profile-navigation.component';
import { ButtonNavigationItemComponent } from '../../shared/UIkit/buttons/button-navigation-item/button-navigation-item.component';
import { CollapseButtonComponent } from './components/profile-info/collapse-button/collapse-button.component';
import { IconChevronsDownComponent } from '../../shared/icons/icon-chevrons-down/icon-chevrons-down.component';
import { IconChevronsUpComponent } from '../../shared/icons/icon-chevrons-up/icon-chevrons-up.component';
import { InputTextComponent } from '../../shared/UIkit/inputs/input-text/input-text.component';
import { ButtonIconSaveComponent } from '../../shared/UIkit/buttons/button-icon-save/button-icon-save.component';
import { ButtonIconEditComponent } from '../../shared/UIkit/buttons/button-icon-edit/button-icon-edit.component';
import { ButtonCloseComponent } from '../../shared/UIkit/buttons/button-close/button-close.component';
import { ClickToCopyComponent } from '../../shared/complex-ui-components/click-to-copy/click-to-copy.component';
import { NgoLogoIconComponent } from '../../shared/icons/ngo-logo-icon/ngo-logo-icon.component';
import { ShareProfileModalComponent } from './components/share-profile-modal/share-profile-modal.component';
import { ShareModalComponent } from '@ui-components/modals/share-modal/share-modal.component';

@NgModule({
  declarations: [
    ProfileComponent,
    BecomeAdvisorModalComponent,
    ProfileInfoCardComponent,
    ProfileInfoCardTitleComponent,
    RoleDescriptionComponent,
    ProfileImageComponent,
    RecommendOrShareProfileComponent,
    StatsComponent,
    ProfileTopicsExpertiseComponent,
    SegmentTitleComponent,
    ProfileInfoLanguagesComponent,
    EmailNotificationsComponent,
    ProfileNavigationComponent,
    CollapseButtonComponent,
    ShareProfileModalComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    ShareProfileModalModule,
    TranslateModule.forChild(createForChildProviderConfig('profile')),
    ProfileRoutingModule,
    IconSpinnerComponent,
    CoverImageComponent,
    ButtonComponent,
    UploadIconComponent,
    ConversationImageComponent,
    UserIconComponent,
    IsOnlineComponent,
    HorizontalLineComponent,
    TextareaComponent,
    InputTextareaComponent,
    ButtonEditComponent,
    ButtonSaveComponent,
    ValidationErrorsComponent,
    IconRecommendedComponent,
    ShareIconComponent,
    IconShareSecondComponent,
    SkillsButtonListComponent,
    ButtonChipComponent,
    InputSwitchCheckboxLabeledComponent,
    ButtonNavigationItemComponent,
    IconChevronsDownComponent,
    IconChevronsUpComponent,
    InputTextComponent,
    ButtonIconSaveComponent,
    ButtonIconEditComponent,
    ButtonCloseComponent,
    ClickToCopyComponent,
    NgoLogoIconComponent,
    ShareModalComponent,
  ],
  exports: [ProfileInfoCardTitleComponent],
})
export class ProfileModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
