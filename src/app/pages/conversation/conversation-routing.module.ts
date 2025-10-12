import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationComponent } from './layout/conversation.component';
import { conversationResolver } from './resolvers/conversationResolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      chatInfo: conversationResolver,
    },
    component: ConversationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationRoutingModule {}
