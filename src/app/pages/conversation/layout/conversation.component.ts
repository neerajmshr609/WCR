import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  Conversation,
  createConversation,
  IceBreakerConversation,
  IConversationUserInfo,
} from 'src/app/shared/models/conversation.model';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ResizeService } from '../../../services/resize.service';
import { FooterService } from '../../../services/footer/footer.service';
import { FullscreenService } from '../../../services/fullscreen.service';
import { ConversationHeaderService } from '../../../shared/modules/header/providers/conversation-header.service';
import { ConversationsService } from '../../../services/conversations.service';
import { ChatStateService } from '../../../services/chat-state.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-100%)' })),
      transition('* => *', animate(200)),
    ]),
  ],
})
export class ConversationComponent extends BaseComponent implements OnInit {
  public selectFeedbackFromConversationEvt =
    new EventEmitter<NewsfeedFeedback>();

  public activeConversationPartners: IConversationUserInfo[];
  public activeConversationRater: IConversationUserInfo;
  public internalChatConversation = signal<Conversation | null>(null);
  public conversation: Conversation | IceBreakerConversation;
  public isDesktop$!: Observable<boolean>;
  currentUser: User;
  project: Project;

  activePane: string;
  menuItems = [
    {
      name: 'Chat room',
      disabled: false,
      param: 'chatroom',
      count: 0,
    },
    {
      name: 'Project review',
      disabled: false,
      param: 'project',
      count: 0,
    },
  ];

  constructor(
    private websocketService: WebsocketService,
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private resizeService: ResizeService,
    private readonly _footerService: FooterService,
    private fullScreenService: FullscreenService,
    private readonly conversationService: ConversationsService,
    private conversationHeaderService: ConversationHeaderService,
    private chatStateService: ChatStateService,
  ) {
    super();
    const { chatInfo } = this.route.snapshot.data;
    this.conversation = createConversation({
      ...chatInfo.conversation,
      messages: chatInfo.messages,
    });
    this.currentUser = chatInfo.user;
    // @ts-ignore
    this.fullScreenService.setFullScreen({ forDevice: ['mobile'] });
  }

  markAllRead() {
    const networkCalls = [];
    for (const message of this.conversation.messages) {
      if (
        !message.read &&
        message.user_id !== this.currentUser.id &&
        message.id !== this.websocketService.newMessage$.value?.id
      ) {
        const call = this.messagesService.markMessageRead(message.id).pipe(
          tap(() => {
            const type =
              this.currentUser.id === this.activeConversationRater.user_id
                ? 'my_advice'
                : 'my_works';
            const value =
              this.messagesService.unreadConversationsMessages$.value;
            value[type]--;
            this.messagesService.unreadConversationsMessages$.next(value);
          }),
        );
        message.read = true;
        networkCalls.push(call);
      }
    }

    for (const session of this.conversation.message_payment_sessions) {
      if (
        !session.read &&
        this.activeConversationRater.user_id !== this.currentUser.id &&
        session.id !== this.websocketService.newSession$.value?.id
      ) {
        const call = this.messagesService.markSessionRead(session.id);
        session.read = true;
        networkCalls.push(call);
      }
    }

    forkJoin(networkCalls).pipe(takeUntil(this.destroyed)).subscribe();
  }

  didSelectMenuItem(index: number) {
    switch (index) {
      case 0: {
        this.activePane = 'left';
        break;
      }
      case 1: {
        this.activePane = 'right';
        break;
      }
    }
  }

  ngOnInit() {
    this._footerService.hideFooter();
    this.setActiveConversationPartner();
    this.setActiveConversationRater();

    this.isDesktop$ = this.resizeService.isDesktop$;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._footerService.displayFooter();
    this.fullScreenService.resetFullScreenState();
    this.conversationHeaderService.clearComponent();
  }

  private setActiveConversationPartner() {
    if (this.conversation.members.length > 1) {
      this.activeConversationPartners = this.conversation.members.filter(
        (member) => member.user_id !== this.currentUser.id,
      );
    } else {
      // TODO: remove this block when we have real partner in questionnare but not only current user
      this.activeConversationPartners = this.conversation.members;
    }
  }

  private setActiveConversationRater() {
    // TODO This is a tamp and wrong logic, need markers in response to select rater right
    if (this.project?.user?.id === this.currentUser?.id) {
      this.activeConversationRater = this.conversation.members.filter(
        (member) => member.user_id !== this.currentUser.id,
      )[0];
    } else {
      this.activeConversationRater = this.currentUser;
    }
  }
}
