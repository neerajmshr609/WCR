import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { inject } from '@angular/core';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { ConversationsService } from '../../../services/conversations.service';
import { User } from '../../../shared/models/user.model';
import { Conversation } from '../../../shared/models/conversation.model';
import { Message } from '../../../shared/models/message.model';
import { ChatStateService } from '../../../services/chat-state.service';

export const conversationResolver: ResolveFn<
  [User, Conversation, Message[]]
> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<[User, Conversation, Message[]]> => {
  const activatedRoute = inject(ActivatedRoute);
  const conversationsService: ConversationsService =
    inject(ConversationsService);
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  const chatStateService = inject(ChatStateService);
  const params = route.params;
  const queryParams = route.queryParams;
  // @ts-ignore
  return authService.userSubject$.pipe(
    filter((user: User) => !!user),
    take(1),
    switchMap((user: User) => {
      const conversationRequests: Observable<any>[] = [];

      if (params.id) {
        conversationRequests.push(
          conversationsService.fetchConversation(params.id),
        );
      } else {
        conversationRequests.push(
          conversationsService.createConversation(
            user.id,
            +queryParams.conversationPartnerID,
            +queryParams.projectID,
            null,
          ),
        );
      }
      conversationRequests.push(
        conversationsService.getChatMessages(
          params.id,
          chatStateService.paginationStateSnapshot.itemsPerPage,
        ),
      );
      return combineLatest([of(user), ...conversationRequests]);
    }),
    map(([user, conversation, messages]: [User, Conversation, Message[]]) => {
      return {
        user,
        conversation,
        messages,
      };
    }),
    catchError((err) => {
      router.navigate(['../'], { relativeTo: activatedRoute });
      return throwError(() => err);
    }),
  );
};
