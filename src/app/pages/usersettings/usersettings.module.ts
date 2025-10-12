import { CUSTOM_ELEMENTS_SCHEMA, effect, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgArrayPipesModule, NgMathPipesModule } from 'ngx-pipes';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UsersettingsRoutingModule } from './usersettings-routing.module';
import { UsersettingsComponent } from './usersettings.component';
import { RateCurrencyComponent } from './components/rate-currency/rate-currency.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmModalModule } from '../../shared/components/confirm-modal/confirm-modal.module';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { LanguagesComponent } from './components/languages/languages.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { SkillsetItemComponent } from './components/topics/skillset-item/skillset-item.component';
import { AccountInformationComponent } from './sections/account-information/account-information.component';
import { TopicsAndExpertiseComponent } from './sections/topics-and-expertise/topics-and-expertise.component';
import { FinanceComponent } from './sections/finance/finance.component';
import { ButtonComponent } from 'src/app/shared/UIkit/button/button.component';
import { InputComponent } from 'src/app/shared/UIkit/input/input.component';
import { SelectComponent } from 'src/app/shared/UIkit/select/select.component';
import { TopicsComponent } from './components/topics/topics.component';
import { AdvisorSkillsetComponent } from './components/advisor-skillset/advisor-skillset.component';
import { FinancesStripeComponent } from './components/finances-stripe/finances-stripe.component';
import { PayoutRequestModalComponent } from './components/finances-stripe/payout-request-modal/payout-request-modal.component';
import { PayoutRequestComponent } from './components/finances-stripe/payout-request/payout-request.component';
import { SchedulingComponent } from './sections/scheduling/scheduling.component';
import { WeekComponent } from './sections/scheduling/week/week.component';
import { NotificationsComponent } from './sections/notifications/notifications.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentsSavingComponent } from './components/finances-stripe/payments-saving/payments-saving.component';
import { PaymentsPayingComponent } from './components/finances-stripe/payments-paying/payments-paying.component';
import { PaymentsNotSupportedComponent } from './components/finances-stripe/payments-not-supported/payments-not-supported.component';
import { PaymentsManualPayoutsComponent } from './components/finances-stripe/payments-manual-payouts/payments-manual-payouts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './sections/user-management/user-management.component';
import { UserPermissionsComponent } from './components/user-permissions/user-permissions.component';
import { OrganizationAdjustmentsComponent } from './components/organization-adjustments/organization-adjustments.component';
import { UserAccordionComponent } from './components/user-permissions/user-accordion/user-accordion.component';
import { FiltersComponent } from './components/user-permissions/filters/filters.component';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { UserManagementIconComponent } from '../../shared/icons/user-management-icon/user-management-icon.component';
import { PublicVisibilityComponent } from './sections/public-visibility/public-visibility.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';
import { UserManagementService } from './services/user-management.service';

import { MoreMenuComponent } from 'src/app/shared/more-menu/more-menu.component';
import { SwitchComponent } from 'src/app/shared/switch/switch.component';
import { OrgInformationComponent } from './sections/org-information/org-information.component';
import { SaveIconComponent } from 'src/app/shared/icons/save-icon/save-icon.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { OrgFormComponent } from './components/org-form/org-form.component';
import { UserApproveIconComponent } from 'src/app/shared/icons/user-approve-icon/user-approve-icon.component';
import { LandingPageIconComponent } from 'src/app/shared/icons/landing-page-icon/landing-page-icon.component';
import { LandingFormComponent } from './components/landing-form/landing-form.component';
import { OrgFormItemComponent } from './components/org-form-item/org-form-item.component';
import { UserUploadImageService } from '../../services/upload-image.service';
import { UserPermissionsService } from './services/user-permissions.service';
import { CreateOrgComponent } from './sections/create-org/create-org.component';
import { PlusIconComponent } from '../../shared/icons/plus-icon/plus-icon.component';
import { PermissionService } from 'src/app/auth/service/permission.service';
import { OrgSkillsComponent } from './components/org-skills/org-skills.component';
import { OrgSkillItemComponent } from './components/org-skills/org-skill-item/org-skill-item.component';
import { ButtonIconOvalComponent } from 'src/app/shared/UIkit/buttons/button-icon-oval/button-icon-oval.component';
import { SkillFilterComponent } from '../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { SharingAdviceGuideModalComponent } from './components/sharing-advice-guide-modal/sharing-advice-guide-modal.component';

@NgModule({
  declarations: [
    UsersettingsComponent,
    AdvisorSkillsetComponent,
    SkillsetItemComponent,
    RateCurrencyComponent,
    FinancesStripeComponent,
    SchedulingComponent,
    WeekComponent,
    PayoutRequestModalComponent,
    PayoutRequestComponent,
    LanguagesComponent,
    ClientFormComponent,
    TopicsComponent,
    NotificationsComponent,
    AccountInformationComponent,
    TopicsAndExpertiseComponent,
    FinanceComponent,
    PermissionListComponent,
    PaymentsSavingComponent,
    PaymentsPayingComponent,
    PaymentsNotSupportedComponent,
    PaymentsManualPayoutsComponent,
    UserManagementComponent,
    UserPermissionsComponent,
    OrganizationAdjustmentsComponent,
    FiltersComponent,
    PublicVisibilityComponent,
    OrgInformationComponent,
    OrgFormComponent,
    LandingFormComponent,
    OrgFormItemComponent,
    CreateOrgComponent,
    OrgSkillsComponent,
    OrgSkillItemComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    UsersettingsRoutingModule,
    NgArrayPipesModule,
    NgMathPipesModule,
    NgxMatTimepickerModule,
    ConfirmModalModule,
    TranslateModule.forChild(createForChildProviderConfig('usersettings')),
    SectionHeaderComponent,
    MatSlideToggleModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MainContentMenuModule,
    UserAccordionComponent,
    MatIconModule,
    NgClass,
    UserManagementIconComponent,
    MoreMenuComponent,
    SwitchComponent,
    SaveIconComponent,
    UserApproveIconComponent,
    LandingPageIconComponent,
    PlusIconComponent,
    ButtonIconOvalComponent,
    SkillFilterComponent,
  ],
  providers: [
    UploaderService,
    UsersService,
    UserPermissionsService,
    OrganizationService,
    UserUploadImageService,
    UserManagementService,
    PermissionService,
  ],
  exports: [WeekComponent, PublicVisibilityComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersettingsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
