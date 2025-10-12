import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { UserIconComponent } from '../../icons/user-icon/user-icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Conversation,
  ConversationState,
  ConversationStateType,
  ConversationType,
} from '../../models/conversation.model';
import { GroupChatComponent } from '../../icons/group-chat/group-chat.component';
import { randomFromRange } from '../../functions/random-from-range';
import { NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConversationUserInfo } from '../../models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { defaultOrgAvatars } from '../../const/default-org-images';
import { getRandomAvatarSrc } from '../../../pages/usersettings/constants/avatars';
import { getPseudoRandomImg } from '../../functions/get-pseudo-random-img';

@Component({
  selector: 'app-conversation-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-users.component.html',
  styleUrl: './conversation-users.component.scss',
  imports: [
    UserIconComponent,
    MatTooltipModule,
    GroupChatComponent,
    NgStyle,
    TranslateModule,
  ],
})
export class ConversationUsersComponent implements OnInit {
  public members = input<ConversationUserInfo[]>();
  public conversationPartner = input<ConversationUserInfo>();
  public currentUserId = input.required<number>();
  public conversationImage = input<string>();
  public name = input<string>();
  public conversation = input<Conversation>();
  public type = input<ConversationType | ConversationStateType>();
  public consultant: WritableSignal<ConversationUserInfo | null> = signal(null);
  public anotherMembers!: ConversationUserInfo[];
  public readonly colors = [
    '#B9EBC1',
    '#EBE3B9',
    '#EBC3B9',
    '#B9CDEB',
    '#EBB9E4',
  ];
  public types = signal({ ...ConversationType, ...ConversationState });

  public readonly defaultUserAvatar = getRandomAvatarSrc(
    this.anotherMembers ? this.anotherMembers[0].id : 1,
  );
  public readonly defaultGroupAvatar = 'assets/avatars/default_group.png';
  public defaultOrganizationAvatar: string;
  subtitle:any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.subtitle = this.conversation().conversation_skill.skill.name;
    this.defaultOrganizationAvatar = getPseudoRandomImg(
      this.conversation().organization_id,
      defaultOrgAvatars,
    );
    this.anotherMembers = this.members()?.filter(
      (member) => member.user_id !== this.currentUserId(),
    );

    this.members().forEach((member) => {
      if (member.user_role === 'consultant') {
        this.consultant.set(member);
      }
    });
  }

  public getRandomColor(): string {
    return this.colors[randomFromRange(0, this.colors.length - 1)];
  }
}
