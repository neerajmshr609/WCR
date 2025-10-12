import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationInvitationRoutingModule } from './routing/organization-invitation-routing.module';
import { InvitationConfirmationComponent } from './components/invitation-confirmation/invitation-confirmation.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { CloseIconComponent } from '../../shared/icons/close-icon/close-icon.component';
import { IconUserPlusComponent } from '../../shared/icons/icon-user-plus/icon-user-plus.component';
import { AuthModule } from '../../auth/auth.module';
import { MarkIconComponent } from '../../shared/icons/mark-icon/mark-icon.component';
import { IconAnchorComponent } from '@icons/icon-anchor/icon-anchor.component';
import { LoginIconComponent } from '@icons/login-icon/login-icon.component';

@NgModule({
  declarations: [InvitationConfirmationComponent, ConditionsComponent],
  imports: [
    CommonModule,
    OrganizationInvitationRoutingModule,
    ButtonComponent,
    TranslateModule.forChild(createForChildProviderConfig('auth')),
    CloseIconComponent,
    IconUserPlusComponent,
    AuthModule,
    MarkIconComponent,
    IconAnchorComponent,
    LoginIconComponent,
  ],
})
export class OrganizationInvitationModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
