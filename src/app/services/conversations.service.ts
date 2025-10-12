import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  API_URL,
  CONVERSATIONS_URL,
  CONVERSATION_URL,
  LESSONS_URL,
  LESSON_PAYMENT_STATUS_UPDATE_URL,
  LESSON_URL,
  PAYMENT_SESSIONS_STATUS_UPDATE_URL,
  PAYMENT_SESSIONS_URL,
  PAYMENT_SESSION_URL,
  MESSAGES_URL,
  LIST_USERS_TO_ADD_URL,
  ADD_CONVERSATION_MEMBER_URL,
  CONVERSATION_FOR_ANONYMOUS_USER_URL,
  CREATE_NEW_CONVERSATION,
  END_QUESTIONNARE,
  ANONYMOUS_CONVERSATION_URL,
  ADD_CONVERSATION_MEMBER,
  CONNECT_TO_CONVERSATION,
  ACCEPT_CASE_URL,
  REJECT_CASE_URL,
  ESCALATE_REQUEST,
} from 'src/config/config';
import { catchError, map, take, tap, switchMap } from 'rxjs/operators';
import {
  Conversation,
  createConversation,
  CreatedConversation,
  CreateNewConversationDTO,
  IConversationUserInfo,
} from '../shared/models/conversation.model';
import { Lesson } from '../shared/models/lesson.model';
import { Message, MessageSpecial } from '../shared/models/message.model';
import { PaymentSession } from 'src/app/shared/models/payment-session';
import { PaymentRequestBySeconds } from 'src/app/shared/models/payment-request';
import { UserSkill } from '../shared/models/UserSkill.model';
import { IS_CREATED_ICE_BREAKER_BEFORE } from '../shared/constants';
import { User, userFactory } from '../shared/models/user.model';
import { createHttpParams } from '../shared/functions/http-params';
import { IUsersSearchResponse } from '../shared/models/response/users-search.interface';
import { IAddUserToConversationResponse } from '../shared/models/response/add-user-to-conversation-response.interface';
import { MessageWs } from '../shared/models/message-ws';
import { AuthService } from '../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IAnonymousUserResponse } from '../auth/model/anonymous-user-response.interface';
import {
  AddMemberResponse,
  ConnectMemberResponse,
} from '../shared/models/response/add-member-response';

interface NewFeedBackConversation {
  success: boolean;
  conversation: Conversation;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationsService {
  public activeConversation = new BehaviorSubject<number>(null);
  public specialMessage$ = new BehaviorSubject<{
    messageType: MessageSpecial;
    message: Message | MessageWs;
  }>(null);

  private needUpdateConversationSubject = new BehaviorSubject(false);

  public needUpdateConversation$ =
    this.needUpdateConversationSubject.asObservable();

  private readonly members = signal<IConversationUserInfo[]>([]);
  private readonly _anonymousUserId = toSignal(
    this._authService.anonymousUserId$,
  );

  constructor(
    private http: HttpClient,
    private readonly _authService: AuthService,
  ) {}

  public needUpdateConversation() {
    this.needUpdateConversationSubject.next(true);
  }

  public fetchConversation(id: number) {
    if (this._anonymousUserId()) {
      const params = createHttpParams({
        conversation_id: id,
        user_id: this._anonymousUserId(),
      });
      return this.http
        .get<{
          conversation: Conversation;
        }>(ANONYMOUS_CONVERSATION_URL, { params })
        .pipe(map((_) => _.conversation))
        .pipe(map((_) => createConversation(_)));
    }
    return this.http
      .get<Conversation>(CONVERSATION_URL(id))
      .pipe(map((_) => createConversation(_)));
  }

  getChatMessages(
    conversationId: number,
    limit: number = 20,
    before?: number,
    user_anonymous_id?: number,
  ): Observable<Message[]> {
    let params = new HttpParams();
    params = params.append('conversation_id', conversationId);
    params = params.append('limit', limit);

    if (user_anonymous_id) {
      params = params.append('user_anonymous_id', user_anonymous_id);
    }

    if (this._anonymousUserId()) {
      params = params.append('user_anonymous_id', this._anonymousUserId());
    }

    if (before) {
      params = params.append('before', before);
    }
    return this.http
      .get<Message[]>(MESSAGES_URL, {
        params,
      })
      .pipe(
        map((_) => _.sort((a, b) => a.id - b.id)),
        tap((messages: Message[]) =>
          this.detectConversationSpecialMessages(messages),
        ),
      );
  }

  public fetchLessons() {
    return this.http.get<Lesson[]>(LESSONS_URL);
  }

  private createLesson(lesson: Lesson) {
    return this.http.post<Lesson>(LESSONS_URL, { ...lesson });
  }

  public updateLesson(lesson: any): Observable<Lesson> {
    return this.http.put<Lesson>(LESSON_URL(lesson.id), { lesson });
  }

  public deleteLesson(lesson: Lesson) {
    return this.http.delete<Lesson>(LESSON_URL(lesson.id));
  }

  public markConversationAsResolved(conversationID: number) {
    return this.http.put<Conversation>(CONVERSATION_URL(conversationID), {
      isclarification: false,
    });
  }

  public createTutotingRequestLesson(
    conversationId: number,
    studentId: number,
    advisorId: number,
    meetingtime: string,
    confirmed: boolean = false,
    teacher_id?: number,
  ) {
    const lesson: Lesson = {
      meetingtime,
      student_id: studentId,
      teacher_id: advisorId || teacher_id,
      conversation_id: conversationId,
      confirmed,
    };

    return this.createLesson(lesson);
  }

  public denyPaymentRequestForLesson(lessonID: number) {
    return this.http.put<Message>(LESSON_URL(lessonID), {
      paymentrequestdenied: true,
    });
  }

  public createTutotingRequestConversation(
    sender_id: number,
    recipient_id: number,
    project_id: number,
    user_skill: UserSkill,
    advisorrate: number,
  ) {
    return this.http.post<Conversation>(CONVERSATIONS_URL, {
      sender_id,
      recipient_id,
      project_id,
      user_skill,
      advisorrate,
    });
  }

  public createClarificationConversation(
    sender_id: number,
    recipient_id: number,
    project_id: number,
  ) {
    return this.http.post<Conversation>(CONVERSATIONS_URL, {
      sender_id,
      recipient_id,
      project_id,
      isclarification: true,
    });
  }

  public createConversation(
    sender_id: number,
    recipient_id?: number,
    project_id?: number,
    advisorrate?: number,
    projectfile_id?: number,
  ) {
    return this.http
      .post<Conversation>(CONVERSATIONS_URL, {
        sender_id,
        recipient_id,
        project_id,
        projectfile_id,
        advisorrate,
      })
      .pipe(map((response) => this.createConversationFromResponse(response)));
  }

  public createNewFeedbackChat(
    rating_id?: number,
    conversation_type?: string,
    project_id?: number,
  ) {
    return this.http
      .post<NewFeedBackConversation>(CREATE_NEW_CONVERSATION, {
        rating_id,
        conversation_type,
        project_id,
      })
      .pipe(map((response) => response.conversation));
  }

  public createNewAnonConversation(
    questionnaire_id: number,
    skill_id: number,
    conversation_type: string,
    conversation_status: string,
    user_anonymous_id?: number,
  ): Observable<{ user_id: number; conversation: Conversation }> {
    return this.http
      .post<{ conversation: Conversation }>(CREATE_NEW_CONVERSATION, {
        user_anonymous_id,
        skill_id,
        questionnaire_id,
        conversation_type,
        conversation_status,
      })
      .pipe(map((response) => this.mapResponseToConversation(response)));
  }

  public fetchQuestionnaireConversationForAnonUser(
    user_id: number,
    questionnaire_id: number,
  ) {
    let params = new HttpParams();
    params = params.append('user_id', user_id);
    params = params.append('questionnaire_id', questionnaire_id);
    return this.http
      .get<{ conversation: Conversation[] }>(
        CONVERSATION_FOR_ANONYMOUS_USER_URL,
        {
          params,
        },
      )
      .pipe(
        map((response) => {
          if (response) {
            return this.createConversationFromResponse(response.conversation);
          } else {
            return null;
          }
        }),
      );
  }

  private mapResponseToConversation(response: { conversation: Conversation }): {
    user_id: number;
    conversation: Conversation;
  } {
    const { conversation } = response as {
      conversation: Conversation & IAnonymousUserResponse;
    };
    return {
      user_id: conversation.user_anonymous_id || null,
      conversation: this.createConversationFromResponse(conversation),
    };
  }

  public createRoom(
    student_id: number,
    teacher_id: number,
    conversation_id: number,
  ) {
    const url = API_URL + 'create_room/';
    return this.http.post(url, {
      lesson: { student_id, teacher_id, conversation_id },
    });
  }

  public closeRoom(lessonID: number) {
    const url = API_URL + 'close_room/';
    return this.http.post(url, { lessonID });
  }

  public markLessonAsConfirmed(lessonID: number, confirmed: boolean) {
    const lesson = { confirmed };
    return this.http.put<Lesson>(LESSON_URL(lessonID), { lesson });
  }

  public markLessonAsFinished(lessonID: number) {
    const lesson = { finished: true };
    return this.http.put<Lesson>(LESSON_URL(lessonID), { lesson });
  }

  public updatePrice(conversationId: number, newPrice: number) {
    return this.http.put(CONVERSATION_URL(conversationId), {
      advisorrate: newPrice,
    });
  }

  public updateReadMassages(conversationId: number, massages: Message[]) {
    return this.http.put(CONVERSATION_URL(conversationId), { massages });
  }

  public disconnectUserFromAdvisor(
    disconnectType: string,
    disconnectUserId: number,
  ) {
    const url = API_URL + 'disconnected_users';
    return this.http.post(url, {
      disconnected_user: {
        disconnect_type: disconnectType,
        disconnect_user_id: disconnectUserId,
      },
    });
  }

  public createPaymentSession(): Observable<number> {
    return this.http
      .post<{ id: number }>(PAYMENT_SESSIONS_URL, {})
      .pipe(map((res) => res.id));
  }

  public updatePaymentSession(
    id: number,
    value: Partial<PaymentSession> | Partial<PaymentRequestBySeconds>,
  ): Observable<void> {
    return this.http.put<void>(PAYMENT_SESSION_URL(id), { ...value });
  }

  public updatePaymentStatus(
    payment_id: string,
    type: 'lesson' | 'paymentSession',
  ): Observable<void> {
    const url =
      type === 'paymentSession'
        ? PAYMENT_SESSIONS_STATUS_UPDATE_URL
        : LESSON_PAYMENT_STATUS_UPDATE_URL;

    return this.http.put<void>(url, { payment_id });
  }

  ifEverCreatedIceBreakerEarlier(currentUser: User): boolean {
    const isCreateBeforeIceBreaker = localStorage.getItem(
      IS_CREATED_ICE_BREAKER_BEFORE,
    );
    return !!(
      currentUser.icebreakers?.length || isCreateBeforeIceBreaker?.length
    );
  }

  createConversationFromResponse(response: any): Conversation {
    return {
      ...response,
      messages: response.messages || [],
      lessons: response.lessons || [],
      user_skills: response.user_skills || [],
      message_payment_sessions: response.message_payment_sessions || [],
    };
  }

  getChatMembers(): IConversationUserInfo[] {
    return this.members();
  }

  setChatMembers(members: IConversationUserInfo[]) {
    this.members.set(members);
  }

  getUsersListToAdd(searchStr: string, conversation: Conversation) {
    return this.http
      .get<IUsersSearchResponse>(LIST_USERS_TO_ADD_URL, {
        params: createHttpParams({
          conversation_id: conversation.id,
          search: searchStr,
        }),
      })
      .pipe(
        map(({ users }) => users.map(userFactory)),
        catchError((error) => {
          console.error('Error fetching users to add:', error);
          return of([]);
        }),
      );
  }

  addUserToConversation(conversation: Conversation, user: User) {
    return this.http
      .post<IAddUserToConversationResponse>(ADD_CONVERSATION_MEMBER_URL, {
        conversation_id: conversation.id,
        user_id: user.id,
      })
      .pipe(
        map(({ conversation_member }) => userFactory(conversation_member)),
        tap((newMember) => {
          const currentMembers = this.members();
          this.setChatMembers([...currentMembers, newMember]);
        }),
        catchError((error) => {
          console.error('Error adding user to conversation:', error);
          return of(null);
        }),
      );
  }

  acceptOpenRequestCase(conversation: Conversation) {
    return new BehaviorSubject(conversation).asObservable().pipe(
      take(1),
      switchMap((_) =>
        this.http.post(ACCEPT_CASE_URL, { conversation_id: conversation.id }),
      ),
    );
  }

  rejectOpenRequestCase(conversation: Conversation) {
    return new BehaviorSubject(conversation).asObservable().pipe(
      take(1),
      switchMap((_) =>
        this.http.post(REJECT_CASE_URL, { conversation_id: conversation.id }),
      ),
    );
  }

  escalateOpenRequestCase(conversation: Conversation) {
    return new BehaviorSubject(conversation).asObservable().pipe(
      take(1),
      switchMap((_) =>
        this.http.put(ESCALATE_REQUEST, { conversation_id: conversation.id }),
      ),
    );
  }

  public createNewConversation(body: CreateNewConversationDTO) {
    return this.http.post<CreatedConversation>(CREATE_NEW_CONVERSATION, body);
  }

  public endQuestionnaire(conversation_id: number) {
    return this.http.put<any>(END_QUESTIONNARE, { conversation_id });
  }

  public detectConversationSpecialMessages(messages: Message[]) {
    // TODO: Need to change logic of filtering already answered questions, need some flag from server
    const yesNoQuestions: Message[] = [];
    messages.forEach((message) => {
      if (message.special === 'yes_no_question') {
        yesNoQuestions.push(message);
      }
    });

    const filteredYesNoQuestions = yesNoQuestions.filter((question) => {
      return !messages.some(
        (message) => message?.replay_message?.id === question.id,
      );
    });

    if (filteredYesNoQuestions.length > 0) {
      const message = filteredYesNoQuestions[0];
      this.specialMessage$.next({
        messageType: 'yes_no_question',
        message,
      });
    } else {
      this.specialMessage$.next(null);
    }
  }

  public clearSpecialMessage() {
    this.specialMessage$.next(null);
  }

  public addConversationMember(body: {
    user_id: number;
    conversation_id: number;
  }): Observable<AddMemberResponse> {
    return this.http.post<AddMemberResponse>(ADD_CONVERSATION_MEMBER, body);
  }

  public connectConversation(body: {
    user_id: number;
    conversation_id: number;
  }): Observable<ConnectMemberResponse> {
    return this.http.post<ConnectMemberResponse>(CONNECT_TO_CONVERSATION, body);
  }
}
