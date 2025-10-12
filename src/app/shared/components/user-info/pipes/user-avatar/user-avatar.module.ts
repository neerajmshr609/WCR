import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarPipe } from './user-avatar.pipe';

@NgModule({
  declarations: [UserAvatarPipe],
  exports: [UserAvatarPipe],
  imports: [CommonModule],
})
export class UserAvatarModule {}
