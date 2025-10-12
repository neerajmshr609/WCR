import { effect, NgModule } from '@angular/core';

import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationsComponent } from './layout/conversations.component';
import { ConversationsServicesModule } from './services/conversations-services.module';
import { ConversationItemComponent } from './components/conversation-item/conversation-item.component';
import { FilterComponent } from './components/filter/filter.component';
import { StatsComponent } from './components/stats/stats.component';
import { UserJourneyComponent } from './components/user-journey/user-journey.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SplitJourneyNamePipe } from './pipes/split-journey-name.pipe';
import { ConversationUsersComponent } from '../../shared/components/conversation-users/conversation-users.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ConversationRowComponent } from './components/conversation-row/conversation-row.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { ButtonComponent } from 'src/app/shared/UIkit/button/button.component';
import { NewConversationModule } from './components/new-conversation/new-conversation.module';
import { EmptyConversationsComponent } from './components/empty-conversations/empty-conversations.component';

@NgModule({
  declarations: [
    ConversationsComponent,
    UserJourneyComponent,
    ConversationItemComponent,
    FilterComponent,
    StatsComponent,
    UserJourneyComponent,
    SplitJourneyNamePipe,
  ],
  imports: [
    SharedModule,
    EmptyConversationsComponent,
    ButtonComponent,
    ConversationsRoutingModule,
    ConversationsServicesModule,
    ConversationUsersComponent,
    FilterPanelComponent,
    ConversationRowComponent,
    NewConversationModule,
    TranslateModule.forChild(createForChildProviderConfig('conversations')),
  ],
  exports: [
    StatsComponent,
  ],
})
export class ConversationsModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
