import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  MESSAGE_URL,
  MESSAGES_URL,
  PAYMENT_SESSION_URL,
  SOFT_DELETE_MESSAGE_URL,
  UNREAD_MESSAGES_URL,
} from 'src/config/config';
import { Message, messageFactory } from '../shared/models/message.model';
import { PaymentSession } from '../shared/models/payment-session';
import { AuthService } from '../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { createHttpParams } from '../shared/functions/http-params';
import { ISoftDeleteMessageResponse } from '../shared/models/response/message-deleted.interface';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  unreadMessages$ = new BehaviorSubject<number>(0);
  unreadConversationsMessages$ = new BehaviorSubject<{
    my_advice: number;
    my_works: number;
  }>({ my_advice: 0, my_works: 0 });
  public copiedMessage: Message;

  public get unreadMessages(): number {
    return this.unreadMessages$.value;
  }

  readonly anonymousUserId = toSignal(this._authService.anonymousUserId$);

  constructor(
    private readonly _authService: AuthService,
    private http: HttpClient,
  ) {}

  getMessage(messageId: number) {
    if (this.anonymousUserId()) {
      const params = createHttpParams({
        user_anonymous_id: this.anonymousUserId(),
      });
      return this.http
        .get<Message>(MESSAGE_URL(messageId), { params })
        .pipe(map((_) => messageFactory(_)));
    }
    return this.http
      .get<Message>(MESSAGE_URL(messageId))
      .pipe(map((_) => messageFactory(_)));
  }

  updateMessage(
    messageId: number,
    body: Partial<Message>,
  ): Observable<Message> {
    const params = this.anonymousUserId()
      ? createHttpParams({
          message_id: messageId,
          user_id: this.anonymousUserId(),
        })
      : null;
    return this.http
      .put<Message>(
        MESSAGE_URL(messageId),
        {
          ...body,
        },
        { params },
      )
      .pipe(map((_) => messageFactory(_)));
  }

  public deleteMessage(id: number) {
    return this.http.delete(MESSAGE_URL(id));
  }

  public softDeleteMessage(message: Message) {
    return this.http
      .put<ISoftDeleteMessageResponse>(SOFT_DELETE_MESSAGE_URL, {
        message_id: message.id,
        datetime: new Date().toISOString(),
      })
      .pipe(map((_) => messageFactory(_.user_message)));
  }

  markMessageRead(messageId: number) {
    return this.http.put<Message>(MESSAGE_URL(messageId), { read: true }).pipe(
      map((_) => messageFactory(_)),
      tap(() =>
        this.unreadMessages$.next(
          this.unreadMessages ? this.unreadMessages - 1 : 0,
        ),
      ),
    );
  }

  getSession(id: number): Observable<PaymentSession> {
    return this.http.get(PAYMENT_SESSION_URL(id));
  }

  markSessionRead(id: number): Observable<PaymentSession> {
    return this.http
      .put(PAYMENT_SESSION_URL(id), { read: true })
      .pipe(
        tap(() =>
          this.unreadMessages$.next(
            this.unreadMessages ? this.unreadMessages - 1 : 0,
          ),
        ),
      );
  }

  acceptPaymentRequestForMessage(messageId: number) {
    return this.http.put<Message>(MESSAGE_URL(messageId), {
      paymentrequestapproved: true,
    });
  }

  denyPaymentForMessageID(messageId: number) {
    return this.http.put<Message>(MESSAGE_URL(messageId), {
      paymentrequestdenied: true,
    });
  }

  createMessage(message: Message) {
    return this.http
      .post<Message>(MESSAGES_URL, {
        ...message,
        message_screenshots_attributes: message.message_screenshots,
        user_anonymous_id: this.anonymousUserId() || null,
      })
      .pipe(map((_) => messageFactory(_)));
  }

  fetchMessagesCount(): void {
    this.http
      .get<{ my_advice: number; my_works: number }>(UNREAD_MESSAGES_URL)
      .pipe(
        tap((res) => {
          this.unreadMessages$.next(res.my_advice + res.my_works);
          this.unreadConversationsMessages$.next(res);
        }),
      )
      .subscribe();
  }
}
