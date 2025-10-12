import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageNotificationComponent } from './message-notification.component';
import { UserAvatarModule } from '../user-info/pipes/user-avatar/user-avatar.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MessageNotificationComponent],
  imports: [CommonModule, UserAvatarModule, RouterModule],
})
export class MessageNotificationModule {}
