import { effect, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { OpenRequestsComponent } from './components/_open-requests/open-requests.component';
import { LanguageService } from '../../services/language.service';
import { RouterModule } from '@angular/router';
import { OpenRequestCardComponent } from './components/open-request-card/open-request-card.component';
import { IsNgoConsultantGuard } from './guard/is-ngo-consultant.guard';
import { SummaryComponent } from './components/summary/summary.component';
import { QueuedByComponent } from './components/queued-by/queued-by.component';
import { AddToReviewQueueComponent } from './components/add-to-review-queue/add-to-review-queue.component';
import { createArtcategoriesApiUrlsProvider } from '../../services/artcategory/artcategory-api-urls.provider';
import { createSkillApiUrlsProvider } from '../../services/skill/skill-api-urls.provider';
import { MainContentMenuModule } from '../../main-content-menu/main-content-menu.module';
import { SkillFilterComponent } from '../../shared/model-based-components/skill/skill-filter/skill-filter.component';
import { WelcomeCardComponent } from '../../shared/complex-ui-components/welcome-card/welcome-card.component';
import { HeartIconComponent } from '../../shared/icons/heart-icon/heart-icon.component';
import { AddButtonComponent } from '../../shared/UIkit/buttons/add-button/add-button.component';
import { CategoryNameComponent } from '../../shared/model-based-components/category-name/category-name.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { MessageSquareIconComponent } from '../../shared/icons/message-square-icon/message-square-icon.component';
import { QueueIconComponent } from '../../shared/icons/queue-icon/queue-icon.component';
import { ConversationImageComponent } from '../../shared/model-based-components/conversation-image/conversation-image.component';
import { ExpertiseTitleCardComponent } from '../../shared/model-based-components/skill/expertise-title-card/expertise-title-card.component';
import { HorizontalLineComponent } from '../../shared/UIkit/horizontal-line/horizontal-line.component';
import { IconSpinnerComponent } from '../../shared/icons/icon-spinner/icon-spinner.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { IconPeopleComponent } from '../../shared/icons/icon-people/icon-people.component';
import { IconPullRequestComponent } from '../../shared/icons/icon-pull-request/icon-pull-request.component';
import { IconArrowComponent } from '@icons/icon-arrow/icon-arrow.component';
import { TypingCardComponent } from '../../shared/components/typing-card/typing-card.component';

@NgModule({
  declarations: [
    OpenRequestsComponent,
    OpenRequestCardComponent,
    SummaryComponent,
    QueuedByComponent,
    AddToReviewQueueComponent,
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
    CommonModule,
    TranslateModule.forChild(createForChildProviderConfig('open-requests')),
    RouterModule.forChild([
      {
        path: '',
        component: OpenRequestsComponent,
        canActivate: [IsNgoConsultantGuard],
      },
    ]),
    MainContentMenuModule,
    SkillFilterComponent,
    WelcomeCardComponent,
    HeartIconComponent,
    AddButtonComponent,
    CategoryNameComponent,
    ButtonComponent,
    MessageSquareIconComponent,
    QueueIconComponent,
    ConversationImageComponent,
    ExpertiseTitleCardComponent,
    HorizontalLineComponent,
    IconSpinnerComponent,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    IconPeopleComponent,
    IconPullRequestComponent,
    IconArrowComponent,
    TypingCardComponent,
  ],
})
export class OpenRequestsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
