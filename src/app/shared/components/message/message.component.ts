import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  model,
  output,
  Output,
} from '@angular/core';
import { Message } from '../../models/message.model';
import { NewsfeedFeedback } from '../../models/newsfeedfeedback.model';
import {
  Conversation,
  IConversationUserInfo,
} from '../../models/conversation.model';
import { AuthService } from '../../../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  readonly message = model.required<Message>();
  readonly conversation = input<Conversation | null>(null);
  readonly systemMessageOnly = input<boolean>(false);
  readonly isFeedbackMessage = input<boolean>(false);
  readonly deleteMessage = output<Message>();
  public enterMeet = output<Lesson>();
  currentUser = toSignal(this._authService.authorizedUser$);
  @Input() public isRater: boolean;
  @Input() public paymentSessionId: number;
  @Input() public canReply: boolean;
  @Input() public canEdit: boolean;

  @Input() public feedback: NewsfeedFeedback;
  @Input() public feedbackQuestion: Message;
  @Input() public allowCopyMessage: boolean;
  @Input() public initialMessage: Message;

  @Input() recipients: IConversationUserInfo[];
  @Input() type: 'message' | 'pqa' = 'message';
  @Input() pqaId: number;

  @Output() public find = new EventEmitter<NewsfeedFeedback>();
  @Output() public reply = new EventEmitter<void>();
  @Output() public edit = new EventEmitter<number>();
  @Output() public scrollToInitialMessage = new EventEmitter<void>();
  public isInternalChat = input<boolean>(false);
  public copied: boolean;
  languages: string[] = [];

  constructor(private readonly _authService: AuthService) {}

  readonly isSystemMessage = computed(() => {
    return (
      this.systemMessageOnly() ||
      this.message().system_message ||
      (this.message().special && this.message().special !== 'regular') ||
      (this.conversation()?.isIceBreaker() &&
        this.conversation().icebreaker_member.owner_id ===
          this.message().user_id)
    );
  });
  readonly isMessageOwner = computed(() => {
    if (!this.message()?.user_id || !this.currentUser()?.id) {
      return false;
    }
    return this.message().user_id === this.currentUser()?.id;
  });

  readonly chatMessageAlignRight = computed(
    () => this.isMessageOwner() || this.isSystemMessage(),
  );
  readonly chatMessageAlignLeft = computed(() => {
    return !this.isMessageOwner();
  });

  readonly justifySelf = computed(() => {
    if (this.chatMessageAlignLeft()) {
      return 'left';
    }
    if (this.chatMessageAlignRight()) {
      return 'right';
    }
  });

  readonly isIceBreakerOwner = computed(() => {
    return (
      this.conversation()?.isIceBreaker() &&
      this.conversation().icebreaker_member.owner_id === this.currentUser().id
    );
  });
  readonly icebreakerTitle = computed(() => {
    return this.conversation()?.isIceBreaker()
      ? this.conversation().icebreaker_member.title
      : '';
  });

  updateMessage(message: Message) {
    this.message.set(message);
  }

  public onEnterClasroomClick($event: Lesson) {
    this.enterMeet.emit($event);
  }
}
