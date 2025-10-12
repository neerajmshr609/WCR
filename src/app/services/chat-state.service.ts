import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Message, messageFactory } from '../shared/models/message.model';
import { Pagination } from '../shared/models/pagination';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Lesson } from '../shared/models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class ChatStateService {
  private readonly messages: BehaviorSubject<Message[]> = new BehaviorSubject<
    Message[]
  >([]);
  readonly hasSentMessages$ = combineLatest([
    this._authService.authorizedUser$,
    this.messages.asObservable(),
  ]).pipe(
    map(([currentUser, messages]) =>
      messages.some((_) => _.user.id === currentUser.id),
    ),
  );

  private readonly pagination: BehaviorSubject<Pagination> =
    new BehaviorSubject<Pagination>({
      oldestMessageId: null,
      canLoadMore: false,
      itemsPerPage: 20,
    });

  constructor(private readonly _authService: AuthService) {}

  public tempMessage = new Map<string, Message>();

  get messagesState(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  set messagesState(messages: Message[]) {
    const messagesNewState = [...messages.map(messageFactory)];
    this.messages.next(messagesNewState);
  }

  get messagesStateSnapshot(): Message[] {
    return [...this.messages.value];
  }

  set paginationState(newState: Partial<Pagination>) {
    this.pagination.next({ ...this.paginationStateSnapshot, ...newState });
  }

  get paginationState(): Observable<Pagination> {
    return this.pagination.asObservable();
  }

  get paginationStateSnapshot(): Pagination {
    return { ...this.pagination.value };
  }

  initConversation(messages: Message[]): void {
    // TODO check this in case with empty messages
    const firstMessageId = messages[0]?.id;
    this.messagesState = [...messages];
    this.paginationState = this.initPaginationState(
      messages.length,
      firstMessageId,
    );
  }

  initPaginationState(
    length: number,
    oldestMessageId: number | undefined,
  ): Partial<Pagination> {
    return {
      oldestMessageId,
      canLoadMore: length === this.paginationStateSnapshot.itemsPerPage,
    };
  }

  addOldestMessagesToChat(messages: Message[]): void {
    // TODO check this in case with empty messages
    this.messagesState = [...messages, ...this.messagesStateSnapshot];
    this.paginationState = {
      oldestMessageId: messages[0]?.id,
      canLoadMore:
        messages.length === this.paginationStateSnapshot.itemsPerPage,
    };
  }

  updatedLessonInMessage(lesson: Lesson): void {
    const message = this.messagesStateSnapshot.find(
      (m) => m.service_info?.id === lesson.id,
    );
    if (message) {
      message.service_info = lesson;
    }
    this.addNewMessageToChat(message);
  }

  addNewMessageToChat(message: Message): void {
    if (message) {
      message.local_timestamp = message?.local_timestamp || Date.now();
      message.isPending = !message.id;
      message.id = message.id || 0;
    }

    const indexOfFoundedMessage = this.messagesStateSnapshot.findIndex(
      (m: Message) => m.local_timestamp === message?.local_timestamp,
    );
    if (indexOfFoundedMessage > -1) {
      this.messagesState = [
        ...this.messagesStateSnapshot.slice(0, indexOfFoundedMessage),
        message, // Updated item
        ...this.messagesStateSnapshot.slice(indexOfFoundedMessage + 1),
      ];
      return;
    }
    this.messagesState = [...this.messagesStateSnapshot, message];
  }

  clearState(): void {
    this.messagesState = [];
    this.paginationState = {};
  }
}
