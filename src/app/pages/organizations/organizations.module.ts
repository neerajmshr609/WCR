import { effect, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationProfileComponent } from './organization-profile/organization-profile.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { InputComponent } from '../../shared/UIkit/input/input.component';
import { SearchComponent } from '../../shared/UIkit/search/search.component';
import { SettingsIconComponent } from '../../shared/icons/settings-icon/settings-icon.component';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { PartnersCardComponent } from './components/partners-card/partners-card.component';
import { NgoFooterComponent } from './components/ngo-footer/ngo-footer.component';
import { NgoLogoIconComponent } from '../../shared/icons/ngo-logo-icon/ngo-logo-icon.component';
import { NgoFooterLogoIconComponent } from '../../shared/icons/ngo-footer-logo-icon/ngo-footer-logo-icon.component';
import { FacebookIconComponent } from '../../shared/icons/facebook-icon/facebook-icon.component';
import { InstagramIconComponent } from '../../shared/icons/instagram-icon/instagram-icon.component';
import { LinkedinIconComponent } from '../../shared/icons/linkedin-icon/linkedin-icon.component';
import { XIconComponent } from '../../shared/icons/x-icon/x-icon.component';
import { YoutubeIconComponent } from '../../shared/icons/youtube-icon/youtube-icon.component';
import { TextareaComponent } from '../../shared/UIkit/textarea/textarea.component';
import { CounselorsVerticalCarouselComponent } from './components/counselors-vertical-carousel/counselors-vertical-carousel.component';
import { ArrowDownIconComponent } from '../../shared/icons/arrow-down-icon/arrow-down-icon.component';
import { ArrowUpIconComponent } from '../../shared/icons/arrow-up-icon/arrow-up-icon.component';
import { createArtcategoriesApiUrlsProvider } from '../../services/artcategory/artcategory-api-urls.provider';
import { SkillFilterComponent } from '../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { IceBreakersListComponent } from '../../ice-breaker/modules/ice-breakers-list/ice-breakers-list.component';
import { ChevronDownIconComponent } from '../../shared/icons/chevron-down-icon/chevron-down-icon.component';

@NgModule({
  declarations: [
    OrganizationProfileComponent,
    MemberCardComponent,
    PartnersCardComponent,
    NgoFooterComponent,
    CounselorsVerticalCarouselComponent,
  ],
  providers: [
    createArtcategoriesApiUrlsProvider({
      GET: 'artcategories',
    }),
  ],
  imports: [
    SharedModule,
    OrganizationsRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('organizations')),
    ButtonComponent,
    InputComponent,
    SearchComponent,
    SettingsIconComponent,
    NgoLogoIconComponent,
    NgoFooterLogoIconComponent,
    FacebookIconComponent,
    InstagramIconComponent,
    LinkedinIconComponent,
    XIconComponent,
    YoutubeIconComponent,
    TextareaComponent,
    ArrowDownIconComponent,
    ArrowUpIconComponent,
    SkillFilterComponent,
    IceBreakersListComponent,
    ChevronDownIconComponent,
  ],
})
export class OrganizationsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
