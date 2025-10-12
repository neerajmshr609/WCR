import {
  DestroyRef,
  Directive,
  HostListener,
  inject,
  InputSignal,
  signal,
  Signal,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import {
  Conversation,
  IConversationUserInfo,
} from '../../shared/models/conversation.model';
import { ConversationsService } from '../../services/conversations.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { Lesson, LessonPaymentRequset } from '../../shared/models/lesson.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message } from '../../shared/models/message.model';
import { ChatStateService } from '../../services/chat-state.service';
import { differenceInMinutes, isSameDay } from 'date-fns';
import { ResizeService } from '../../services/resize.service';

export type VideoContainerView =
  | 'horizontal'
  | 'maximize'
  | 'vertical'
  | 'square'
  | 'minimize';

@Directive({
  selector: 'jitsu',
  standalone: true,
})
export abstract class VideoCallDirective {
  jitsiApi: any;
  meetingStartTimer$ = new BehaviorSubject<boolean>(false);
  meetingInProgress$ = new BehaviorSubject<boolean>(null);
  protected resizeService = inject(ResizeService);
  public lastMeeting: Lesson;
  public videoCallRequested: boolean;
  public jitsiIframeIsLoading = false;
  lesson = signal<Lesson | null>(null);
  meetingDateCheckSub: Subscription;
  meetingToday: boolean;
  meetingCanStart: boolean;
  protected abstract chatStateService: ChatStateService;
  abstract currentUser: Signal<User | null>;
  abstract conversation: Conversation;

  protected abstract conversationsService: ConversationsService;
  protected paymentRequests: LessonPaymentRequset[];
  protected abstract destroyRef: DestroyRef;
  abstract activeConversationRater: InputSignal<IConversationUserInfo>;
  public videoContainerView = signal<VideoContainerView>('horizontal');
  public isVideoCallFullView = signal(false);
  public isVideoCallDraggable = signal(false);
  public hideEnterVideoCall = signal(false);

  public chatWidth = signal<number>(null);
  public chatHeight = signal<number>(null);

  protected offsetX = signal<number>(null);
  protected offsetY = signal<number>(null);
  protected isDragging = signal(false);
  abstract scrollOnHistory(): void;

  abstract reloadConversation(): Observable<number | number[]>;

  protected abstract sendMessage(fields: {
    [p: string]: any;
  }): Observable<Message>;

  // Вход в комнату видео чата по клику на кнопку "войти в комнату"
  onEnterClasroomClick() {
    this.hideEnterVideoCall.set(false);
    if (!document.querySelector('#jitsi-script')) {
      return new Promise(() => this.loadScript().then(() => this.createRoom()));
    }

    this.createRoom();
  }

  // Загрузка джитси
  loadScript(): Promise<Event> {
    const node = document.createElement('script');
    node.src = 'https://' + environment.jitsiUrl + '/external_api.js';
    node.type = 'text/javascript';
    node.id = 'jitsi-script';
    document.querySelector('head').appendChild(node);

    return new Promise((resolve) => (node.onload = resolve));
  }

  // Создание комнаты в джитси на бэке, после этого - открытие фрейма
  createRoom() {
    this.jitsiIframeIsLoading = true;

    this.conversationsService
      .createRoom(
        this.currentUser().id,
        this.conversation.members.find(
          (member) => member.user_id !== this.currentUser().id,
        ).user_id,
        this.conversation.id,
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res: Lesson) => {
          this.openIframe(res);
          this.updateCurrentMeetStatus(res, 'process');
        }),
      )
      .subscribe();
  }

  // Открытие фрейма
  openIframe(lesson: Lesson) {
    // Очистка предыдущей сессии Jitsi
    if (this.jitsiApi) {
      try {
        this.jitsiApi.dispose(); // корректно завершает все слушатели, соединения и UI
      } catch (err) {
        console.warn('Ошибка при dispose Jitsi:', err);
      }
      this.jitsiApi = null;
    }

    // Очистка DOM контейнера, если там всё ещё старый iframe
    const container = document.getElementById('jitsi-container');
    if (container) {
      container.innerHTML = ''; // удалит iframe и очистит содержимое
    }

    const domain = environment.jitsiUrl;
    const jitsiConfig = {
      height: 455,
      interfaceConfigOverwrite: {
        APP_NAME: 'getme.global',
        DEFAULT_REMOTE_DISPLAY_NAME: 'getme user',
        DEFAULT_LOGO_URL: '',
        DEFAULT_WELCOME_PAGE_LOGO_URL: '',
        JITSI_WATERMARK_LINK: '',
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        VIDEO_QUALITY_LABEL_DISABLED: true,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 1,
        CONNECTION_INDICATOR_DISABLED: true,
        TOOLBAR_BUTTONS: [
          'fullscreen',
          'camera',
          'toggle-camera',
          'raisehand',
          'tileview',
          'videobackgroundblur',
          'hangup',
          'desktop',
          'microphone',
          'sharedvideo',
          'videoquality',
          'recording',
        ],
      },
      configOverwrite: {
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        startScreenSharing: false,
        disableDeepLinking: true,
      },

      parentNode: container,
      onload: () => {
        this.jitsiIframeIsLoading = false;
        setTimeout(() => this.scrollOnHistory());
        this.meetingInProgress$.next(true);

        setTimeout(() => {
          this.meetingStartTimer$.next(
            this.currentUser().id === this.activeConversationRater().user_id &&
              this.jitsiApi.getNumberOfParticipants() > 1,
          );
        }, 3000);
      },
    };

    const options = {
      roomName: lesson.name,
      jwt: lesson.token,

      ...jitsiConfig,
    };

    this.jitsiApi = new (window as any).JitsiMeetExternalAPI(domain, options);

    // Адвизор не может запускать таймер, пока ученика нет в комнате
    this.jitsiApi.addEventListener('participantJoined', (res) => {
      const recipientIndex = this.conversation.members.findIndex(
        (member) => member.username === res.displayName,
      );
      if (recipientIndex !== -1) {
        this.conversation.members[recipientIndex].jitsiId = res.id;
      }

      setTimeout(() => {
        this.meetingStartTimer$.next(
          this.jitsiApi.getNumberOfParticipants() > 1 &&
            this.conversation.members.some(
              (member) => member.username === res.displayName,
            ),
        );
      }, 2000);
    });

    // Комната закрывается, если кто-то положил трубку или вылетел с сайта
    this.jitsiApi.addEventListener('participantLeft', () => {
      this.meetingInProgress$.next(false);
      this.closeIframe();
      this.updateCurrentMeetStatus(lesson, 'created');
    });
    this.jitsiApi.addEventListener('readyToClose', (event) => {
      this.meetingInProgress$.next(false);
      this.closeIframe();
      this.updateCurrentMeetStatus(lesson, 'created');
    });
  }

  protected updateCurrentMeetStatus(
    lesson: Lesson,
    status: 'created' | 'process' | 'ended',
  ) {
    const updatedLesson = { ...lesson, status };
    const lessonInConversation = this.conversation.lessons.find(
      (l) => l.id === lesson.id,
    );
    this.conversation.lessons[
      this.conversation.lessons.indexOf(lessonInConversation)
    ] = updatedLesson;
    this.chatStateService.updatedLessonInMessage(updatedLesson);
  }

  // Закрытие комнаты в джитси
  closeRoom(room: Lesson) {
    let currentLesson = this.conversation.lessons.find(
      (lesson) =>
        !lesson.finished &&
        lesson.meetingtime === this.conversation.lastmeetingtime,
    );
    const paymentRequest = this.paymentRequests.find(
      (req) => req.id === currentLesson.id,
    );
    this.meetingInProgress$.next(false);
    this.conversation.lastmeetingfinished = true;

    // При закрытии комнаты закрывается урок, к которому был привязан видео чат
    // Студенту отправляется счет на оплату

    this.chatStateService.updatedLessonInMessage(room);
    this.conversationsService
      .closeRoom(room.id)
      .pipe(
        mergeMap(() =>
          this.conversationsService
            .updateLesson({
              id: currentLesson.id,
              finished: true,
              seconds: paymentRequest?.due_seconds,
              billable_seconds: paymentRequest.billable_seconds,
            })
            .pipe(
              tap((lesson) => {
                const index = this.conversation.lessons.indexOf(lesson);
                const lessons = [...this.conversation.lessons];
                lessons[index] = lesson;
                this.chatStateService.updatedLessonInMessage(lesson);
              }),
            ),
        ),
        tap((res: Lesson) => (currentLesson = res)),
        mergeMap(() => this.reloadConversation()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.closeIframe();
      });
  }

  closeIframe() {
    this.jitsiApi.dispose();
    this.jitsiApi.removeEventListener('readyToClose');
    this.jitsiApi.removeEventListener('participantJoined');
    this.jitsiApi.removeEventListener('participantLeft');
    this.jitsiApi = null;
  }

  // Когда приходит заявка на митинг, его можно принять или отколонить
  markConversationMeetingAsConfirmed(value: boolean) {
    const special = value ? 'meeting_accepted' : 'meeting_denied';

    this.conversationsService
      .markLessonAsConfirmed(this.lastMeeting.id, value)
      .pipe(
        tap(() => (this.conversation.lastmeetingconfirmed = value)),
        mergeMap(() => this.sendMessage({ special })),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Запрос видео звонка прямо из комнаты, из кнопки в боковом меню
  public requestVideoCall() {
    const otherUser = this.conversation.members.find(
      (member) => member.user_id !== this.currentUser().id,
    );

    this.conversationsService
      .createTutotingRequestLesson(
        this.conversation.id,
        this.currentUser().id,
        this.activeConversationRater().user_id,
        new Date().toString(),
        true,
        otherUser.user_id,
      )
      .pipe(
        tap(() => (this.videoCallRequested = true)),
        tap((lesson) => this.lesson.set(lesson)),
        mergeMap(() =>
          this.sendMessage({
            special: 'meeting_request',
            lesson_id: this.lesson().id,
          }),
        ),
        mergeMap(() => this.reloadConversation()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public get unratedLessons(): Lesson[] {
    return this.conversation.lessons?.filter(
      (lesson) => !lesson.rated && lesson.finished && lesson.paid,
    );
  }

  public get unpaidLessonRequest(): LessonPaymentRequset {
    const unpaidLesson = this.conversation.lessons
      ?.slice()
      .reverse()
      .find((lesson) => !lesson.rated && lesson.finished && !lesson.paid);
    if (unpaidLesson) {
      return this.paymentRequests.find((r) => r.id === unpaidLesson.id);
    }
  }

  // Проверяет, не опоздали ли мы на запланированный митинг
  checkMeetingDate() {
    const today = new Date();
    const meetingDate = new Date(this.conversation.lastmeetingtime);
    this.meetingToday = isSameDay(meetingDate, today);
    this.meetingCanStart = true;

    // this.meetingDateCheckSub = interval(1000)
    //   .pipe(map(() => today))
    //   .subscribe((date) => {
    //     this.meetingCanStart =
    //       this.meetingToday &&
    //       differenceInMinutes(new Date(date), meetingDate) < 11;
    //
    //     if (this.meetingCanStart) {
    //       this.meetingDateCheckSub.unsubscribe();
    //     }
    //   });
  }

  protected handleLessonSocketEvent(lesson: Lesson) {
    const exist = this.conversation.lessons.find((l) => l.id === lesson.id);
    if (exist) {
      const index = this.conversation.lessons.indexOf(exist);
      const lessons = [...this.conversation.lessons];
      lessons[index] = lesson;
      // @ts-ignore
      this.conversation = {
        ...this.conversation,
        lessons,
      };
      this.chatStateService.updatedLessonInMessage(lesson);
    } else {
      this.conversation.lessons.push(lesson);
      this.conversation.lastmeetingtime = lesson.meetingtime;
      this.conversation.lastmeetingconfirmed = lesson.confirmed;
      this.checkMeetingDate();
    }
  }
  public minimizeVideoScreen(): void {
    if (this.isVideoCallFullView()) {
      this.resetFullScreen();
    }
    this.isVideoCallDraggable.set(true);
    this.setVideoDragging();
    this.videoContainerView.set('minimize');
  }

  public verticalVideoScreen(): void {
    if (this.isVideoCallFullView()) {
      this.resetFullScreen();
    }
    if (this.isVideoCallDraggable()) {
      this.resetVideoDragging();
    }
    this.videoContainerView.set('vertical');
    this.setSize(this.chatWidth(), this.getChatHeight());
  }

  protected getChatHeight(): number {
    return this.chatHeight();
  }

  public squareVideoScreen(): void {
    if (this.isVideoCallFullView()) {
      this.resetFullScreen();
    }
    if (this.isVideoCallDraggable()) {
      this.resetVideoDragging();
    }
    this.videoContainerView.set('square');
    const height =
      this.chatWidth() < this.chatHeight()
        ? this.chatWidth()
        : this.chatHeight();
    this.setSize(this.chatWidth(), height);
  }

  public horizontalVideoScreen(): void {
    if (this.isVideoCallFullView()) {
      this.resetFullScreen();
    }
    if (this.isVideoCallDraggable()) {
      this.resetVideoDragging();
    }
    this.videoContainerView.set('horizontal');
    this.setSize(this.chatWidth(), 458);
  }

  public maximizeVideoScreen(): void {
    if (this.isVideoCallDraggable()) {
      this.resetVideoDragging();
    }
    this.videoContainerView.set('maximize');
    this.setFullScreen();
  }

  setSize(width: number, height: number) {
    const iframe = document.querySelector(
      `#jitsi-container iframe`,
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.style.width = `${width}px`;
      iframe.style.height = `${height}px`;
    }
  }

  protected setFullScreen(): void {
    this.isVideoCallFullView.set(true);
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const iframeContainer = document.querySelector(
      `#jitsi-container`,
    ) as HTMLElement;
    const iframe = document.querySelector(
      `#jitsi-container iframe`,
    ) as HTMLIFrameElement;
    const height = `calc(100vh - 24px - ${this.getTypeFieldHeight()} - ${this.getTopMargin()})`;
    iframeWrapper.style.position = 'fixed';
    iframeWrapper.style.bottom = this.getBottomMargin();
    iframeWrapper.style.width = '100vw';
    iframeWrapper.style.left = '0';
    iframeWrapper.style.top = this.getTopMargin();
    iframeWrapper.style.height = height;
    iframeContainer.style.height = '100%';
    iframeContainer.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.width = '100%';
  }

  protected resetFullScreen(): void {
    this.isVideoCallFullView.set(false);
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const iframeContainer = document.querySelector(
      `#jitsi-container`,
    ) as HTMLElement;
    const iframe = document.querySelector(
      `#jitsi-container iframe`,
    ) as HTMLIFrameElement;

    iframeWrapper.style.position = 'absolute';
    iframeWrapper.style.bottom = '0';
    iframeWrapper.style.width = 'auto';
    iframeWrapper.style.left = '1px';
    iframeWrapper.style.top = 'auto';
    iframeWrapper.style.height = 'auto';
    iframeContainer.style.height = 'auto';
    iframeContainer.style.width = 'auto';
    iframe.style.width = 'auto';
    iframe.style.height = 'auto';
  }

  protected listenChatSize() {
    const chat = document.getElementsByClassName('chat__history')[0];
    this.resizeService.resize$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setupChatDimension(chat);
      });
  }

  protected setupChatDimension(chatElement: HTMLElement | Element): void {
    if (chatElement) {
      const chatRect = chatElement.getBoundingClientRect();
      this.chatHeight.set(chatRect.height);
      this.chatWidth.set(chatRect.width);
    }
  }

  protected setVideoDragging(): void {
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const iframeContainer = document.querySelector(
      `#jitsi-container`,
    ) as HTMLIFrameElement;
    const iframe = document.querySelector(
      `#jitsi-container iframe`,
    ) as HTMLIFrameElement;
    iframeWrapper.style.position = 'fixed';
    iframeWrapper.style.bottom = this.getBottomMargin();
    iframeWrapper.style.width = '338px';
    iframeWrapper.style.left = this.getLeftMarginForDragginStart();
    iframeWrapper.style.top = this.getTopMargin();
    iframeWrapper.style.height = '224px';
    iframeWrapper.style.maxHeight = '360px';
    iframeContainer.style.maxHeight = '360px';
    iframe.style.maxHeight = '360px';
    iframeContainer.style.borderRadius = '8px';
    iframeContainer.style.overflow = 'hidden';
  }

  protected getLeftMarginForDragginStart(): string {
    return '200px';
  }

  protected getTopMargin(): string {
    return '71px';
  }

  protected getTypeFieldHeight(): string {
    return '78px';
  }

  protected getBottomMargin(): string {
    return '200px';
  }

  protected resetVideoDragging(): void {
    this.isVideoCallDraggable.set(false);
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const iframeContainer = document.querySelector(
      `#jitsi-container`,
    ) as HTMLIFrameElement;
    const iframe = document.querySelector(
      `#jitsi-container iframe`,
    ) as HTMLIFrameElement;
    iframeWrapper.style.position = 'absolute';
    iframeWrapper.style.bottom = '0';
    iframeWrapper.style.width = 'auto';
    iframeWrapper.style.left = '1px';
    iframeWrapper.style.top = 'auto';
    iframeWrapper.style.maxHeight = 'none';
    iframeContainer.style.maxHeight = 'none';
    iframeWrapper.style.height = 'auto';
    iframe.style.maxHeight = 'none';
    iframeContainer.style.borderRadius = '0';
    iframeContainer.style.overflow = 'auto';
  }

  onMouseDown(event: MouseEvent) {
    if (this.isVideoCallFullView()) return;

    this.isDragging.set(true);
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const rect = iframeWrapper.getBoundingClientRect();
    this.offsetX.set(event.clientX - rect.left);
    this.offsetY.set(event.clientY - rect.top);
    event.preventDefault();
  }

  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    if (this.isVideoCallFullView()) return;

    this.isDragging.set(true);
    const iframeWrapper = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    const rect = iframeWrapper.getBoundingClientRect();
    this.offsetX.set(touch.clientX - rect.left);
    this.offsetY.set(touch.clientY - rect.top);
    event.preventDefault();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging.set(false);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging() || this.isVideoCallFullView()) return;
    const container = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    container.style.left = `${event.clientX - this.offsetX()}px`;
    container.style.top = `${event.clientY - this.offsetY()}px`;
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    if (!this.isDragging() || this.isVideoCallFullView()) return;
    const container = document.querySelector(
      `.video-meet-wrapper`,
    ) as HTMLElement;
    container.style.left = `${touch.clientX - this.offsetX()}px`;
    container.style.top = `${touch.clientY - this.offsetY()}px`;
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.isDragging.set(false);
  }

  public checkUpdate(message: Partial<Message>): void {
    if (this.isVideoCallFullView()) {
      this.minimizeVideoScreen();
    }
  }

  public isDateMissed(date: string): boolean {
    const today = new Date();
    const meetingTime = new Date(date);
    return differenceInMinutes(today, meetingTime) > 10;
  }

  // Видео урок запрошен и подтвержден, но время прошло
  public isLessonMissed(lesson: Lesson): boolean {
    return this.isDateMissed(lesson.meetingtime);
  }

  public hideVideoCall(): void {
    this.hideEnterVideoCall.set(true);
  }
}
