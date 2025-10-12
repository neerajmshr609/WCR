import { ChangeDetectionStrategy, Component, computed, input, OnInit, Signal, signal } from '@angular/core';
import { Conversation, IConversationUserInfo } from '../../../../shared/models/conversation.model';
import { ConversationUsersComponent } from '../../../../shared/components/conversation-users/conversation-users.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ConversationUserInfo, User, userFactory } from '../../../../shared/models/user.model';
import { LastMessageComponent } from '../last-message/last-message.component';
import { Message } from '../../../../shared/models/message.model';
import { ConversationTypeComponent } from '../conversation-type/conversation-type.component';
import { RightArrowIconComponent } from '../../../../shared/icons/right-arrow-icon/right-arrow-icon.component';
import { returnConversationType } from '../../../../shared/functions/converstion-types-adapter';

const mockLastMessage = {
  additional_attributes: null,
  attachment: null,
  audio_message: null,
  body: 'mock message for testing... Yes thank you so much 😍 for all the help that the new therapeuth gives me. I dont Know what i would do without it, my days are countless, and 👹empty now i look forward every day for the next appointment to see how my life will change forever and ever and ever and ever',
  created_at: '2024-11-04T13:17:09.000Z',
  deleted: null,
  id: 320,
  initial_message_id: null,
  local_timestamp: 1730726229356,
  message_screenshots: [],
  read: false,
  replay_message: null,
  service_info: null,
  special: null,
  system_message: false,
  user: userFactory({ id: 5, image: null, username: 'Mock User' }),
  user_id: 5,
};

@Component({
  selector: 'app-conversation-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-row.component.html',
  imports: [
    ConversationUsersComponent,
    SharedModule,
    LastMessageComponent,
    ConversationTypeComponent,
    RightArrowIconComponent,
  ],
  styleUrls: ['./conversation-row.component.scss'],
})
export class ConversationRowComponent implements OnInit {
  public conversation = input<Conversation>();
  public type = input<string>();
  public currentUser = input<User>();

  public conversationPartner = signal<ConversationUserInfo | undefined>(
    undefined,
  );
  public members!: Signal<ConversationUserInfo[]>;

  // TODO remove it after BE integration
  public mockMockLatMessage: Message = mockLastMessage;

  constructor() {
  }

  private setConversationPartner(): void {
    const members = this.conversation().members;
    members.forEach((member) => {
      if (member.user_id !== this.currentUser().id) {
        this.conversationPartner.set(member);
      }
    });
  }

  ngOnInit(): void {
    this.setConversationPartner();
    this.members = computed(() => this.conversation().members);
  }

  public convertType(conversation: Conversation) {
    return returnConversationType(conversation);
  }
}
