import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Conversation,
  createConversation,
  IceBreakerConversation,
  IConversationUserInfo,
} from '../../../../shared/models/conversation.model';
import { MobileConversationDetailsComponent } from '../mobile-conversation-details/mobile-conversation-details.component';
import { map, switchMap } from 'rxjs/operators';
import { ConversationsService } from '../../../../services/conversations.service';
import { ChatStateService } from '../../../../services/chat-state.service';

@Component({
  selector: 'app-mobile-conversation',
  standalone: true,
  imports: [CommonModule, MobileConversationDetailsComponent],
  templateUrl: './mobile-conversation.component.html',
  styleUrls: ['./mobile-conversation.component.scss'],
  providers: [ChatStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileConversationComponent {
  public conversation = input<Conversation | IceBreakerConversation>();
  public internalChatConversation = signal<Conversation | null>(null);
  public activeConversationPartners = input<IConversationUserInfo[]>([]);
  public activeConversationRater = input<IConversationUserInfo>();
  public isInternal = signal(false);
  public isRecordingEvent = output<boolean>();

  constructor(
    private conversationsService: ConversationsService,
    private chatStateService: ChatStateService,
  ) {
    effect(() => {
      if (this.isInternal()) {
        const internalChatConversation = untracked(() =>
          this.internalChatConversation(),
        );
        if (!internalChatConversation) {
          this.getInternalChat();
        }
      }
    });
  }

  public handleAudioRecord($event: boolean) {
    this.isRecordingEvent.emit($event);
  }

  private getInternalChat(): void {
    let conversation: Conversation;
    this.conversationsService
      .fetchConversation(this.conversation().internal_chat_id)
      .pipe(
        switchMap((conversationResponse) => {
          conversation = conversationResponse;
          return this.conversationsService.getChatMessages(
            this.conversation().internal_chat_id,
            this.chatStateService.paginationStateSnapshot.itemsPerPage,
          );
        }),
        map((messages) => ({ ...conversation, messages })),
      )
      .subscribe((res: Conversation) => {
        this.internalChatConversation.set(createConversation(res));
      });
  }
}
