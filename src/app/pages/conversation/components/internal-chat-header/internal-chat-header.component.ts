import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Conversation } from '../../../../shared/models/conversation.model';
import { AddingUserComponent } from '../adding-user/adding-user.component';
import { MatDialog } from '@angular/material/dialog';
import { getRandomAvatarSrc } from '../../../usersettings/constants/avatars';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { AddUserIconComponent } from '../../../../shared/icons/add-user-icon/add-user-icon.component';
import { IconMoreVerticalComponent } from '../../../../shared/icons/icon-more-vertical/icon-more-vertical.component';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-internal-chat-header',
  templateUrl: './internal-chat-header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./internal-chat-header.component.scss'],
  imports: [
    ButtonComponent,
    AddUserIconComponent,
    IconMoreVerticalComponent,
    NgClass,
    NgOptimizedImage,
  ],
})
export class InternalChatHeaderComponent {
  public conversation = input<Conversation>(null);

  constructor(private dialog: MatDialog) {}

  public openAddUserPopup() {
    this.dialog.open(AddingUserComponent, {
      data: {
        conversation: this.conversation(),
        inviteTo: 'internal_chat',
        note: 'internal_chat_note',
        isInternal: true,
      },
    });
  }

  public getDefaultAvatar(id = 1) {
    return getRandomAvatarSrc(id);
  }
}
