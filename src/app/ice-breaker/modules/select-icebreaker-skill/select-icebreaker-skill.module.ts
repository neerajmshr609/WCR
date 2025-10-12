import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectIcebreakerSkillRoutingModule } from './routing/select-icebreaker-skill-routing.module';
import { SelectSkillContainerModule } from '../../../shared/components/select-skill-container/select-skill-container.module';
import { MatDialogModule } from '@angular/material/dialog';
import { IconIceBreakerComponent } from '../../../shared/icons/icon-ice-breaker/icon-ice-breaker.component';
import { createForChildProviderConfig } from '../../../shared/app-language/translate-module-provider-config.factory';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { LogoIceBreakerComponent } from '../logo-ice-breaker/logo-ice-breaker.component';
import { createSkillApiUrlsProvider } from '../../../services/skill/skill-api-urls.provider';
import { SkillFilterComponent } from '../../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { createArtcategoriesApiUrlsProvider } from '../../../services/artcategory/artcategory-api-urls.provider';
import { GetHelpModule } from '../../../pages/get-help/get-help.module';
import { CreateCapsuleModalComponent } from '../create-capsule-modal/create-capsule-modal.component';
import { SelectIcebreakerSkillComponent } from './components/select-icebreaker-skill/select-icebreaker-skill.component';

@NgModule({
  declarations: [SelectIcebreakerSkillComponent],
  providers: [
    createSkillApiUrlsProvider({ GET: 'skills/' }),
    createArtcategoriesApiUrlsProvider({
      GET: 'artcategories',
    }),
  ],
  imports: [
    CommonModule,
    SelectIcebreakerSkillRoutingModule,
    SelectSkillContainerModule,
    MatDialogModule,
    IconIceBreakerComponent,
    TranslateModule.forChild(
      createForChildProviderConfig('create-ice-breaker'),
    ),
    LogoIceBreakerComponent,
    SkillFilterComponent,
    CreateCapsuleModalComponent,
    GetHelpModule,
  ],
})
export class SelectIcebreakerSkillModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
