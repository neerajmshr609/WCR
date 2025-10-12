import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupAnimationComponent } from './signup-animation/signup-animation.component';
import { AuthComponent } from './auth.component';
import { InputComponent } from '../shared/UIkit/input/input.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NewUserIconComponent } from '../shared/icons/new-user-icon/new-user-icon.component';
import { ButtonComponent } from '../shared/UIkit/button/button.component';
import { OpenHeartIconComponent } from '../shared/icons/open-heart-icon/open-heart-icon.component';
import { NgoLogoIconComponent } from '../shared/icons/ngo-logo-icon/ngo-logo-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../shared/app-language/translate-module-provider-config.factory';
import { AutocompleteModule } from '../shared/UIkit/autocomplete/autocomplete.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { SearchIconComponent } from '../shared/icons/search-icon/search-icon.component';
import { SmallSpinnerModule } from '../shared/components/small-spinner/small-spinner.module';
import { UserIconComponent } from '@icons/user-icon/user-icon.component';
import { IconDoubleRightArrowComponent } from '@icons/icon-double-right-arrow/icon-double-right-arrow.component';
import { LoginIconComponent } from '@icons/login-icon/login-icon.component';
import { CheckEmailModalComponent } from './check-email-modal/check-email-modal.component';
import { MailIconComponent } from '@icons/mail-icon/mail-icon.component';
import { IconNewUserComponent } from '@icons/icon-new-user/icon-new-user.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SignupAnimationComponent, AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    InputComponent,
    NgOptimizedImage,
    NewUserIconComponent,
    ButtonComponent,
    OpenHeartIconComponent,
    NgoLogoIconComponent,
    TranslateModule.forChild(createForChildProviderConfig('auth')),
    AutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox,
    SearchIconComponent,
    SmallSpinnerModule,
    UserIconComponent,
    IconDoubleRightArrowComponent,
    LoginIconComponent,
    MailIconComponent,
    CheckEmailModalComponent,
    IconNewUserComponent,
    MatIconModule,
  ],
  exports: [AuthComponent],
})
export class AuthModule {}
