import { Component, OnInit, signal } from '@angular/core';
import { Conversation } from '../../shared/models/conversation.model';
import { BaseComponent } from '../../shared/components/base.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { ConversationsService } from '../../services/conversations.service';
import { User } from '../../shared/models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent extends BaseComponent implements OnInit {
  public conversation = signal<Conversation>(null);
  public isLoading = signal<boolean>(true);
  public currentUser = signal<User>(null);


  private userId = signal<number>(null);
  private questionnaireId = signal<number>(null);
  private readonly _userIsAnon = toSignal(this._authService.isAnonymousUser$);

  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _conversationService: ConversationsService,
  ) {
    super();
    this.currentUser.set(this._authService.userSubject$.value);
  }
  ngOnInit() {
    this.checkParams();

    if (!this.currentUser() && this._userIsAnon()) {
      this.currentUser.set(this._authService.createAnonUser(this.userId()));
    }

    if (this.userId() && this.questionnaireId()) {
      this.fetchConversationData().subscribe({
        next: (conversation) => {
          this.conversation.set(conversation);
        },
        complete: () => this.isLoading.set(false),
      });
    }
  }

  private checkParams() {
    const userId = this._route.snapshot.queryParams.userId;
    if (userId && !isNaN(+userId)) {
      this.userId.set(parseInt(userId, 10));
    } else {
      console.warn('Invalid or missing userId:', userId);
    }

    const questionnaireId = this._route.snapshot.queryParams.questionnaireId;
    if (questionnaireId && !isNaN(+questionnaireId)) {
      this.questionnaireId.set(parseInt(questionnaireId, 10));
    } else {
      console.warn('Invalid or missing conversationId:', questionnaireId);
    }
  }

  private fetchConversationData(): Observable<Conversation | null> {
    this.isLoading.set(true);
    return this._conversationService.fetchQuestionnaireConversationForAnonUser(
      this.userId(),
      this.questionnaireId(),
    );
  }
}
