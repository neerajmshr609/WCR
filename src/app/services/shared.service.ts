import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../shared/models/user.model';
import { MessagesService } from './messages.service';
import { ProjectService } from './project.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService implements OnDestroy {
  userLoaded$ = new BehaviorSubject<User>(null);
  subscription = new Subscription();
  isAuthPage$ = new BehaviorSubject<boolean>(false);

  public feedbackRequestsCount = 0;

  constructor(
    private authService: AuthService,
    private websocketService: WebsocketService,
    private messagesService: MessagesService,
    private projectService: ProjectService,
    public router: Router,
  ) {}

  init() {
    this.subscribeToUserLoaded();
    this.subscribeToMessages();
    // this.checkPaidFeedbackRequests();
  }

  private checkPaidFeedbackRequests() {
    this.projectService
      .fetchCreativesProjects(null, 0)
      .pipe(
        tap(
          (res) => (this.feedbackRequestsCount = res.feedback_requests_count),
        ),
        mergeMap(() => this.websocketService.newPaidFeedbackRequest$),
        filter((res) => res),
        tap(() => this.feedbackRequestsCount++),
      )
      .subscribe();
  }

  subscribeToUserLoaded() {
    this.subscription.add(
      this.userLoaded$.subscribe((res: User) => {
        if (!res) {
          this.messagesService.unreadMessages$.next(0);
          return;
        }
        this.messagesService.fetchMessagesCount();
      }),
    );
  }

  subscribeToMessages() {
    this.subscription.add(
      this.authService.authorizedUser$.subscribe((res: User) => {
        if (res) {
          this.websocketService.subscribeToMessages(res.id);

          if (!this.userLoaded$.value) {
            this.userLoaded$.next(res);
          }
        } else {
          this.websocketService.unsubscribeFromMessages();
          this.userLoaded$.next(null);
        }
      }),
    );
  }

  subscribeToSessions(conversationId: number) {
    this.subscription.add(
      this.websocketService.subscribeToSessions(conversationId),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
