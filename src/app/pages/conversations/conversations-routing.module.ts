import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { ConversationsComponent } from './layout/conversations.component';

export const CONVERSATIONS_PATH = 'conversations';

const routes: Routes = [
  {
    path: '',
    component: ConversationsComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        keywords: 'Conversations',
        title: 'All Platform Dialogues',
        description: 'All Platform Dialogues',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationsRoutingModule {}
