import { TuiStepperModule } from '@taiga-ui/kit';
import { effect, NgModule } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { GetHelpComponent } from './get-help.component';
import { SkillFilterComponent } from '../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { GetHelpRoutingModule } from './get-help-routing.module';
import { createArtcategoriesApiUrlsProvider } from '../../services/artcategory/artcategory-api-urls.provider';
import { createSkillApiUrlsProvider } from '../../services/skill/skill-api-urls.provider';
import { IceBreakersListComponent } from '../../ice-breaker/modules/ice-breakers-list/ice-breakers-list.component';
import { IconSpinnerComponent } from '../../shared/icons/icon-spinner/icon-spinner.component';
import { MobileHeaderComponent } from '../../shared/components/mobile-header/mobile-header.component';
import { DesktopHeaderComponent } from '../../shared/components/desktop-header/desktop-header.component';
import { StringTyperComponent } from '../../shared/complex-ui-components/string-typer/string-typer.component';
import { NgClass, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { ChevronDownIconComponent } from '../../shared/icons/chevron-down-icon/chevron-down-icon.component';
import { FilterPanelComponent } from '@ui-components/filter-panel/filter-panel.component';

@NgModule({
  declarations: [
    GetHelpComponent,
    MobileHeaderComponent,
    DesktopHeaderComponent,
  ],
  providers: [
    createArtcategoriesApiUrlsProvider({
      GET: 'artcategories',
    }),
    createSkillApiUrlsProvider({
      GET: 'skills',
    }),
  ],
  imports: [
    GetHelpRoutingModule,
    TranslateModule.forChild(createForChildProviderConfig('get-help')),
    SkillFilterComponent,
    IceBreakersListComponent,
    IconSpinnerComponent,
    StringTyperComponent,
    UpperCasePipe,
    ChevronDownIconComponent,
    NgTemplateOutlet,
    FilterPanelComponent,
    TuiStepperModule,
    NgClass,
  ],
  exports: [DesktopHeaderComponent, MobileHeaderComponent],
})
export class GetHelpModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
