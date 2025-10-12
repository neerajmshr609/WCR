import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  forkJoin,
  from,
  fromEvent,
  Observable,
  of,
  Subject,
  throwError,
  timer,
} from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  catchError,
  delay,
  filter,
  finalize,
  map,
  mergeAll,
  mergeMap,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';
import { OnlineService } from 'src/app/services/online.service';
import { User } from 'src/app/shared/models/user.model';
import {
  Conversation,
  IceBreakerConversation,
  IConversationUserInfo,
} from 'src/app/shared/models/conversation.model';
import {
  Message,
  MessageFile,
  MessageSpecial,
} from 'src/app/shared/models/message.model';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { TransactionsService } from 'src/app/services/transactions.service';
import { ProjectService } from 'src/app/services/project.service';
import { environment } from 'src/environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  Lesson,
  LessonPaymentRequset,
} from 'src/app/shared/models/lesson.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { PaymentSession } from 'src/app/shared/models/payment-session';
import { PaymentRequestBySeconds } from 'src/app/shared/models/payment-request';
import {
  avFileStateEnum,
  PaymentSessionStatuses,
  TipsTypes,
} from 'src/app/shared/enums';
import { addDays, differenceInMinutes, isBefore } from 'date-fns';
import { ConversationsService } from 'src/app/services/conversations.service';
import { InsightsService } from 'src/app/services/insights.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';
import { ANON_USER_ID, COMPANION_URL } from 'src/config/config';
import {
  FunnelAdvisorNames,
  FunnelStudentNames,
} from '../../../shared/enums/funnel';
import {
  IceBreakerTemplateMessage,
  StepQuestionTemplate,
} from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { DialogData } from '../dialog-data';
import { MatDialog } from '@angular/material/dialog';
import { EditIceBreakerModalComponent } from 'src/app/ice-breaker/modules/ice-breaker-template/components/edit-ice-breaker/edit-ice-breaker-modal/edit-ice-breaker-modal.component';
import { isScrollable } from '../../../shared/components/scroll-btn/is-scrollable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatStateService } from '../../../services/chat-state.service';
import { Pagination } from '../../../shared/models/pagination';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { DOCUMENT } from '@angular/common';
import { getFileKind } from 'src/app/shared/functions/get-file-kind';
import { isImageType } from 'src/app/shared/functions/check-types';
import { AudioRecordingService } from 'src/app/services/audio-recorder';
import { MessageWs } from '../../../shared/models/message-ws';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { AudioRecordComponent } from '../../../shared/components/audio-record/audio-record.component';
import { ConversationHeaderService } from '../../../shared/modules/header/providers/conversation-header.service';
import { returnConversationType } from '../../../shared/functions/converstion-types-adapter';
import { ConversationHeaderComponent } from '../components/conversation-header/conversation-header.component';
import { InternalChatHeaderComponent } from '../components/internal-chat-header/internal-chat-header.component';
import { ConversationMobileMenuViewService } from '../providers/conversation-mobile-menu-view.service';
import { OutletService } from '../../../services/outlet.service';
import { IceBreakerService } from '../../../ice-breaker/service/ice-breaker.service';
import {
  shouldShowMessage,
  ShouldShowMessagePipe,
} from '../pipes/should-show-message.pipe';
import { TipsModule } from '../../../shared/components/tips/tips.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReceiptModule } from '../../../shared/components/receipt/receipt.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconArrowComponent } from '../../../shared/icons/icon-arrow/icon-arrow.component';
import { ButtonComponent } from '../../../shared/UIkit/button/button.component';
import { LoginProposalComponent } from '../../../shared/components/login-proposal/login-proposal.component';
import { AdditionalMenuComponent } from '../components/additional-menu/additional-menu.component';
import { IcebreakerConversationActionsComponent } from '../components/icebreaker-conversation-actions/icebreaker-conversation-actions.component';
import { FinishQuestionnaireButtonComponent } from '../components/finish-questionnaire-button/finish-questionnaire-button.component';
import { ScrollBtnModule } from '../../../shared/components/scroll-btn/scroll-btn.module';
import { EnterVideoCallComponent } from '../../../shared/components/enter-video-call/enter-video-call.component';
import { fadeInUpAnimation } from 'angular-animations';
import { VideoCallDirective } from '../video-call.directive';
import { IconSettingsGearComponent } from '@icons/icon-settings-gear/icon-settings-gear.component';
import { IconSettingsComponent } from '@icons/icon-settings/icon-settings.component';
import { IconMinimizeComponent } from '@icons/icon-minimize/icon-minimize.component';
import { IconSquareComponent } from '@icons/icon-square/icon-square.component';
import { IconHorizontalComponent } from '@icons/icon-horizontal/icon-horizontal.component';
import { IconVerticalComponent } from '@icons/icon-vertical/icon-vertical.component';
import { IconDraggableComponent } from '@icons/icon-draggable/icon-draggable.component';
import { IconMaximazeComponent } from '@icons/icon-maximaze/icon-maximaze.component';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.scss'],
  providers: [UploaderService, AudioRecordingService],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0.0 }),
        animate(150, style({ opacity: 1.0 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(150, style({ opacity: 0.0 })),
      ]),
    ]),
    fadeInUpAnimation(),
  ],
  imports: [
    TipsModule,
    SharedModule,
    ReceiptModule,
    TranslateModule,
    InternalChatHeaderComponent,
    ConversationHeaderComponent,
    IconArrowComponent,
    ButtonComponent,
    LoginProposalComponent,
    AdditionalMenuComponent,
    IcebreakerConversationActionsComponent,
    FinishQuestionnaireButtonComponent,
    ScrollBtnModule,
    ShouldShowMessagePipe,
    EnterVideoCallComponent,
    IconSettingsGearComponent,
    IconSettingsComponent,
    IconMinimizeComponent,
    IconSquareComponent,
    IconHorizontalComponent,
    IconVerticalComponent,
    IconDraggableComponent,
    IconMaximazeComponent,
  ],
})
export class ConversationDetailComponent
  extends VideoCallDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('userPhoto') private userPhoto: ElementRef;
  @ViewChild('chatHistoryRef') private chatHistoryRef: ElementRef;
  @ViewChild('textInput') textInputComp!: TextInputComponent;
  @ViewChild('audioInput') audioInputComp!: AudioRecordComponent;
  @ViewChild('headerComponent') private headerComponent!:
    | InternalChatHeaderComponent
    | ConversationHeaderComponent;

  public scrolledChat = output<'UP' | 'DOWN'>();

  protected conversationsService = inject(ConversationsService);
  // Partner - это тот, кто не текущий пользователь
  readonly activeConversationPartners = input<IConversationUserInfo[]>([]);
  // Rater - это тот, кому платят деньги (адвизор)
  readonly activeConversationRater = input<IConversationUserInfo>();
  protected chatStateService = inject(ChatStateService);
  @Input({ alias: 'conversation' }) set conversationInfo(
    conversation: Conversation,
  ) {
    this.conversation = conversation;
    this.chatStateService.initConversation(conversation.messages);
  }

  public showChatHeading = input<boolean>(true);
  public showFinishQuestionnaireButton = input<boolean>(false);
  public anonUser = input<User>(null);

  public readonly signedInUser = toSignal(this.authService.userIsSignedIn$);

  @Output() public selectFeedbackFromConversationEvt =
    new EventEmitter<NewsfeedFeedback>();
  public isInternal = input<boolean>();
  public inputPlaceholder = signal<string>('');
  public isLoading: boolean;
  public bankCardPaymentInProgress: boolean;
  public bankCardPayment: boolean;
  public funnelNumber: number;
  readonly companionTypeName = signal<string>('');
  public conversation: Conversation | IceBreakerConversation;

  // Payment session - оплата за видео урок либо за сессию платных сообщений
  public paymentSessionOpened$ = new BehaviorSubject<boolean | null>(null);

  get paymentSessionOpened(): boolean {
    return this.paymentSessionOpened$.value;
  }

  set paymentSessionOpened(value: boolean) {
    this.paymentSessionOpened$.next(value);
  }

  // Таймер закрывается при закрытии сессии платных сообщений, сессия закрывается когда адвизор ее закроет
  public closeTimer$ = new Subject<boolean | null>();

  private stripe: Stripe;

  protected paymentRequests: LessonPaymentRequset[] = [];
  private messagePaymentRequest: PaymentRequestBySeconds;

  public conversationDidSend$ = new BehaviorSubject<boolean>(false);

  private feedbacks: NewsfeedFeedback[];
  currentUser = signal<User | null>(null);
  public messageToAnswer: Message;
  protected readonly messages$: Observable<Message[]> =
    this.chatStateService.messagesState;
  protected readonly pagination$: Observable<Pagination> =
    this.chatStateService.paginationState;

  protected readonly members = computed(() =>
    this.conversationsService.getChatMembers(),
  );
  readonly specialMessage$ = toSignal(
    this.conversationsService.specialMessage$,
  );

  protected readonly specialWSMessage$ = toSignal(
    this.websocketService.specialMessage$,
  );

  // Для аудио сообщений
  public isRecording: boolean;
  public isRecordingStopped: boolean;
  public audioError = new EventEmitter<boolean>();
  public isAudioMessageUploading: boolean;
  public recorderNotAllowed: boolean;

  // Иконка на кнопке "отправить сообщение"
  public sendBtnSrc = 'assets/icons/send.svg';
  // Когда нажимаем "ответить на сообщение", инпут фокусируется
  public focusInput = new EventEmitter<void>();
  public scaleSendBtn = false;
  public borderColor: string;
  public informMessage: string;

  public readonly funnelStudentNames = FunnelStudentNames;
  public readonly funnelAdvisorNames = FunnelAdvisorNames;

  public isDisplayAdditionalMenu = model(false);
  public isUploadFile = model(false);
  public isStartedUploadAudio = signal(false);
  public isRecordingEvent = output<boolean>();

  protected destroyRef = inject(DestroyRef);

  // Для оплаты чаевых после сессии
  readonly tipsTypes = TipsTypes;
  private _tipsPaymentProcessing$ = new Subject<{
    processing: boolean;
    id: number;
  }>();
  public get tipsPaymentProcessing$(): Observable<{
    processing: boolean;
    id: number;
  }> {
    return this._tipsPaymentProcessing$.pipe(shareReplay(1));
  }

  private _paymentProcessing$ = new Subject<{
    processing: boolean;
    id: number;
  }>();

  public get processing$(): Observable<{ processing: boolean; id: number }> {
    return this._paymentProcessing$.pipe(shareReplay(1));
  }

  dialogData: DialogData[] = [];
  advisorId: number;

  paymentSessionStatuses = PaymentSessionStatuses;
  currentPaymentSession: PaymentSession;

  public messageSentEvt = new EventEmitter<void>();
  stripeDashboardLink$: Observable<string>;
  private uploader = new Uppy({ id: 'message-screenshot-uploader' }).use(
    AwsS3,
    {
      companionUrl: COMPANION_URL,
      metaFields: ['folder'],
    },
  );

  private get paymentSessions(): PaymentSession[] {
    return this.dialogData
      .filter((d) => d.type === 'paymentSession')
      .map((d) => d.data as PaymentSession);
  }

  public get showInputNoAnimation(): boolean {
    return !this.isRecording || this.isRecordingStopped;
  }

  iceBreakerLessonForFeedback: Lesson;
  private sortDialogDataWorker!: Worker;
  isCanScroll = false;
  isCanCreateIceBreaker = false;
  readonly isOwnerOfIceBreaker = signal(false);
  isLoadMoreMessages: WritableSignal<boolean> = signal(false);
  isSendingFile = signal(false);

  firstUnreadMessageId = signal<number | null>(null);
  unreadMessagesNumber = signal(0);
  showScrollBottomButton = signal(false);
  showConfirmationPanel = signal(false);
  backBntMargin = signal<string>(null);

  public confirmationPanelData = signal<{
    questionId: number;
    options: { answer_id: number; text: string }[];
  } | null>(null);

  constructor(
    private transactionsService: TransactionsService,
    private websocketService: WebsocketService,
    private messagesService: MessagesService,
    private insightsService: InsightsService,
    private projectService: ProjectService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private onlineService: OnlineService,
    private route: ActivatedRoute,
    private iceBreakerService: IceBreakerService,
    private dialog: MatDialog,
    private uploaderService: UploaderService,
    @Inject(DOCUMENT) private document: Document,
    private audioRecordingService: AudioRecordingService,
    private conversationHeaderService: ConversationHeaderService,
    public conversationMobileMenuViewService: ConversationMobileMenuViewService,
    private _outletService: OutletService,
  ) {
    super();

    // effect(() => {
    //   const messageData = this.specialMessage$();
    //   if (messageData) {
    //     this.detectSpecialMessages(messageData);
    //   }
    // });

    effect(() => {
      const messageData = this.specialWSMessage$();
      if (messageData) {
        this.detectSpecialMessages(messageData);
      }
    });
  }

  ngAfterViewInit(): void {
    this.subscribeToNewMessages();
    this.subscribeToNewSessions();

    this.fetchFeedbacks();
    this.updateWithoutReloading();

    this.fetchStripeDashboardLink();
    this.checkIfInstantMeeting();
    this.fetchFunnelPosition()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.getLastReadMessageId();
    this.cdRef.detectChanges();

    if (this.chatHistoryRef?.nativeElement) {
      fromEvent(this.chatHistoryRef?.nativeElement, 'scroll')
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          startWith(null),
          tap(() => this.checkScrollPosition()),
        )
        .subscribe();
    }

    if (this.firstUnreadMessageId()) {
      this.scrollToMessage(this.firstUnreadMessageId());
    } else {
      this.scrollOnHistory();
    }

    let lastScrollTop = 0;
    fromEvent(this.chatHistoryRef.nativeElement, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef), skip(1))
      .subscribe((event: any) => {
        const scrollTop =
          this.chatHistoryRef.nativeElement.pageYOffset ||
          this.chatHistoryRef.nativeElement.scrollTop;
        if (scrollTop > lastScrollTop) {
          this.scrolledChat.emit('DOWN');
        } else if (scrollTop < lastScrollTop) {
          this.scrolledChat.emit('UP');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });

    if (this.conversation) {
      this.conversationHeaderService.setUpComponent({
        component: this.headerComponent,
        isComponent: false,
      });
    }

    combineLatest([
      this.conversationMobileMenuViewService.view$,
      this.resizeService.resize$,
    ]).subscribe(([shortView, size]) => {
      // (conversationMobileMenuViewService.view$ | async) ? '12rem' : '22.2rem'"
      if (size < 678) {
        this.backBntMargin.set(shortView ? '12rem' : '20.9rem');
      }
      if (size > 678 && size < 1280) {
        this.backBntMargin.set('23.5rem');
      }
      if (size > 1280) {
        this.backBntMargin.set('1.6rem');
      }
    });

    this.conversationsService.needUpdateConversation$
      .pipe(
        switchMap((isReload) => (isReload ? this.reloadConversation() : EMPTY)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    this.listenChatSize();
  }

  ngOnInit(): void {
    this._subscribeOnAuthUser();
    this.advisorId = this.activeConversationRater()?.user_id;
    loadStripe(environment.stripe.pk).then((res) => (this.stripe = res));
    this.getChatMembers();
    this.loadInitialMessages();
    // Подписка на значок "онлайн" у партнера
    this.onlineService.userChangedOnlineStatus$
      .pipe(
        filter(
          (res) =>
            !!res &&
            res.id ===
              this.conversation.members.filter(
                (member) => member.user_id !== this.currentUser().id,
              )[0].user_id,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        const partnerIndex = this.activeConversationPartners().findIndex(
          (partner) => partner.user_id === res.id,
        );
        if (partnerIndex !== -1) {
          this.activeConversationPartners()[partnerIndex].online = res.online;
        }
      });
    this.websocketService.currentConversationId$.next(this.conversation.id);
    this.getUnreadMessagesNumber();
    this.checkIfOwnerOfIceBreaker();
    this.setInputPlaceholder();
    this.cdRef.detectChanges();
  }

  private getChatMembers() {
    this.conversationsService.setChatMembers(this.conversation.members);
  }

  private getAudioLanguage(): string {
    const languages =
      this.audioRecordingService.createArrayOfAvailableLanguages(
        this.currentUser().lang,
      );
    return this.audioRecordingService.getLastUsedLanguage(languages);
  }

  private uploadAudioMessage(
    blob: Blob,
    title: string,
    duration: number,
    fileName: string,
  ) {
    this.audioRecordingService
      .useAudioUploader(
        blob,
        title,
        this.currentUser().id || ANON_USER_ID,
        fileName,
      )
      .pipe(
        switchMap((res) =>
          this.sendAudioMessage({
            title,
            url: decodeURIComponent(res.successful[0].uploadURL),
            duration,
            name: fileName,
            language: this.getAudioLanguage(),
          }),
        ),
      )
      .subscribe();
  }

  public closeAdditinalMenu() {
    this.isDisplayAdditionalMenu.set(false);
    this.isUploadFile.set(false);
  }

  public sendFiles(): void {
    this.isDisplayAdditionalMenu.set(false);
    this.isSendingFile.set(true);
    this.uploaderService.files.forEach((file) => {
      const uploadMessage: Message = {
        conversation_id: this.conversation.id,
        user: this.currentUser(),
        attachment: {
          url: file.preview,
          kind: getFileKind(file.type),
          mimetype: file.type,
          name: file.name,
          thumbnail: isImageType(file.type) ? file.preview : null,
          loadState: avFileStateEnum.notloaded,
        },
      };

      this.chatStateService.addNewMessageToChat(uploadMessage);

      this.chatStateService.tempMessage.set(
        uploadMessage.attachment.name,
        uploadMessage,
      );
      this.scrollOnHistory();
    });

    from(this.uploaderService.uploadFiles())
      .pipe(
        switchMap((res) => {
          if (res.successful) {
            const requests = [];
            res.successful.forEach((fileResponse) => {
              const tempMessage = this.chatStateService.tempMessage.get(
                fileResponse.name,
              );
              const file: MessageFile = {
                url: fileResponse.uploadURL,
                kind: getFileKind(fileResponse.type),
                mimetype: fileResponse.type,
                name: fileResponse.name,
                thumbnail: isImageType(fileResponse.type)
                  ? fileResponse.uploadURL
                  : null,
                loadState: avFileStateEnum.loaded,
              };
              requests.push(
                this.sendMessage({ ...tempMessage, attachment: file }),
              );
              this.chatStateService.tempMessage.delete(fileResponse.name);
            });
            return from(requests);
          } else {
            return EMPTY;
          }
        }),
        mergeAll(),

        catchError(() => {
          this.snackBar.open('Some things went wrong...', null, {
            duration: 1000,
          });
          this.isDisplayAdditionalMenu.set(false);
          return EMPTY;
        }),

        finalize(() => {
          this.isSendingFile.set(false);
          this.closeAdditinalMenu();
        }),
      )
      .subscribe();
  }

  public displayUploadFileWindow(state: boolean): void {
    this.isUploadFile.set(state);
  }

  public closeUpload(): void {
    this.isUploadFile.set(false);
  }

  // Отображает или скрывает кнопку прокрутки чата вниз
  private checkScrollPosition(): void {
    const scrollTop = this.chatHistoryRef?.nativeElement.scrollTop;
    const scrollHeight = this.chatHistoryRef?.nativeElement.scrollHeight;
    const clientHeight = this.chatHistoryRef?.nativeElement.clientHeight;

    this.showScrollBottomButton.set(
      scrollHeight - scrollTop - clientHeight >= 100,
    );
  }

  private updateWithoutReloading() {
    // this.sortDialogData();
    this.checkForOpenSessions();
    this.parsePaymentRequests();
    if (
      this.conversation.lastmeetingtime &&
      !this.conversation.lastmeetingfinished
    ) {
      this.checkMeetingDate();
    }

    this.lastMeeting = this.conversation.lessons.find(
      (lesson) => lesson.meetingtime === this.conversation.lastmeetingtime,
    );
  }

  private checkIfOwnerOfIceBreaker(): void {
    this.isOwnerOfIceBreaker.set(
      this.conversation.icebreaker_member?.owner_id === this.currentUser()?.id,
    );
  }

  private getUnreadMessagesNumber() {
    this.unreadMessagesNumber.set(this.conversation?.unread_message_count || 0);
  }

  loadMoreMessages(
    chatHistoryRef: HTMLDivElement,
    scrollToPosition: number,
  ): void {
    this.isLoadMoreMessages.set(true);
    this.conversationsService
      .getChatMessages(
        this.conversation.id,
        this.chatStateService.paginationStateSnapshot.itemsPerPage,
        this.chatStateService.paginationStateSnapshot.oldestMessageId,
      )
      .pipe(
        tap((messages: Message[]) => {
          chatHistoryRef.scrollTop = scrollToPosition;
          this.chatStateService.addOldestMessagesToChat(messages);
          this.isLoadMoreMessages.set(false);
        }),
        catchError(() => {
          this.isLoadMoreMessages.set(false);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private fetchStripeDashboardLink() {
    if (this.advisorId !== this.currentUser().id) {
      this.transactionsService
        .fetchStripeDashboardLink()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();

      this.stripeDashboardLink$ =
        this.transactionsService.stripeDashboardLinks$.pipe(
          filter((res) => !!res),
          map((res) => res.billing_url),
        );
    }
  }

  private checkIfInstantMeeting() {
    if (this.route.snapshot.queryParams.instant_meeting) {
      this.onEnterClasroomClick();
    }
  }

  private checkForOpenSessions(): void {
    const paymentSessions: PaymentSession[] = this.paymentSessions.filter(
      (s) => s.status === 'created',
    );
    if (paymentSessions.length) {
      this.currentPaymentSession = paymentSessions[paymentSessions.length - 1];
      this.paymentSessionOpened = true;
    }
  }

  fetchFeedbacks() {
    if (!this.conversation.project) {
      return;
    }

    this.isLoading = true;
    this.insightsService
      .fetchFeedbacksForProjectAndRater(
        this.conversation.project.id,
        this.activeConversationRater()?.user_id,
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res: NewsfeedFeedback[]) => (this.feedbacks = res)),
        tap(() => setTimeout(() => this.scrollOnHistory())),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }

  getFeedback(id: number): NewsfeedFeedback {
    if (!id) {
      return;
    }

    return this.feedbacks.find((feedback) => feedback.id === id);
  }

  getFeedbackQuestion(messageId: number, feedbackId: number): Message {
    if (!feedbackId) {
      return;
    }

    const messages = this.conversation.messages.filter(
      (message) => message.feedback_id === feedbackId,
    );

    if (messages.length < 2) {
      return;
    }
    if (messages.findIndex((message) => message.id === messageId) < 1) {
      return;
    }

    return messages[0];
  }

  sortDialogData() {
    if (this.conversation?.icebreaker_member?.lesson) {
      this.iceBreakerLessonForFeedback = this.iceBreakerFeedbackGenerator(
        this.conversation.icebreaker_member.lesson,
      );
    }
    this.sortDialogDataWorker = new Worker(
      new URL('../sort-dialog-data.worker', import.meta.url),
    );
    this.sortDialogDataWorker.onmessage = ({ data }) => {
      this.dialogData = data;
      setTimeout(() => {
        this.scrollOnHistory();
        this.isCanScroll = isScrollable(this.chatHistoryRef.nativeElement);
      });
    };
    this.sortDialogDataWorker.postMessage({
      conversation: this.conversation,
      iceBreakerLessonForFeedback: this.iceBreakerLessonForFeedback,
    });
  }

  getMessage(item: DialogData) {
    return item.data as Message;
  }

  private getLastReadMessageId() {
    this.messages$.pipe(take(1)).subscribe((messages) => {
      if (
        this.conversation.last_reads &&
        this.conversation.last_reads.length > 0
      ) {
        const incomingMessages = messages.filter(
          (el) => el.user_id !== this.currentUser().id,
        );
        const lastReadId = this.conversation.last_reads.filter(
          (el) => el.user_id !== this.currentUser().id,
        )[0]?.message_id;
        const lastReadMessageIndex = incomingMessages.findIndex(
          (el) => el.id === lastReadId,
        );
        if (lastReadMessageIndex !== -1) {
          this.firstUnreadMessageId.set(
            incomingMessages.filter((el) => !el.read)[0]?.id ||
              incomingMessages[lastReadMessageIndex + 1]?.id,
          );
        }
      }
    });
  }

  private iceBreakerFeedbackGenerator(lesson: Lesson): Lesson | undefined {
    const { created_at } = lesson;
    const shouldShowAt = addDays(new Date(created_at), 1);
    const shouldShow = isBefore(shouldShowAt, new Date());
    if (shouldShow && !lesson.finished) {
      return { ...lesson, created_at: shouldShowAt.toString() };
    }
    return undefined;
  }

  getLesson(item: DialogData) {
    return item.data as Lesson;
  }

  getPaymentSession(item: DialogData) {
    return item.data as PaymentSession;
  }

  subscribeToNewMessages() {
    this.websocketService.newMessage$
      .pipe(
        filter((res) => res && res.conversation_id === this.conversation.id),
        tap((message: MessageWs) => {
          if (message.special === 'meeting_request') {
            this.handleLessonSocketEvent(message.service_info);
          } else {
            this.chatStateService.addNewMessageToChat(message);
            this.websocketService.detectConversationSpecialMessages(message);
          }
        }),
        mergeMap((message: MessageWs) =>
          forkJoin({
            updated: of(message.updated),
            message: this.messagesService.getMessage(message.id),
          }),
        ),
        mergeMap((res: { updated: boolean; message: Message }) =>
          this.conversationsService
            .fetchConversation(this.conversation.id)
            .pipe(
              tap((conversation) => {
                this.conversation = conversation;
                this.conversation.unread_message_count =
                  conversation.unread_message_count;
                this.getUnreadMessagesNumber();
                this.getLastReadMessageId();
              }),
              map(() => ({
                message: res.message,
                updated: res.updated,
              })),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result: { message: Message; updated: boolean }) => {
        if (!result.updated) {
          this.scrollToMessage(result.message?.id, -200);
        }
      });
  }

  private subscribeToNewSessions(): void {
    this.websocketService.subscribeToSessions(this.conversation.id);

    this.websocketService.newSession$
      .pipe(
        filter((res) => res && res.conversation_id === this.conversation.id),
        mergeMap((res) =>
          forkJoin({
            updated: of(res.updated),
            session: this.messagesService.getSession(res.session_id),
          }),
        ),
        mergeMap((res: { updated: boolean; session: PaymentSession }) => {
          if (res.updated) {
            return of(res.session);
          }
          return this.messagesService.markSessionRead(res.session.id);
        }),
        tap((res) => {
          const index = this.conversation.message_payment_sessions.findIndex(
            (message) => message.id === res.id,
          );
          if (
            this.conversation.message_payment_sessions[index].status !==
            res.status
          ) {
            this.conversation.message_payment_sessions.push(res);
          }
          this.updateWithoutReloading();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  userDidUpdatePaidLesson(paymentRequest: PaymentRequestBySeconds) {
    const currentLesson = this.conversation.lessons.find(
      (lesson) =>
        !lesson.finished &&
        lesson.meetingtime === this.conversation.lastmeetingtime,
    );
    const index = this.paymentRequests.findIndex(
      (req) => req.id === currentLesson.id,
    );
    this.paymentRequests[index] = { ...paymentRequest, id: currentLesson.id };
  }

  // onCounterUpdate(paymentRequest: PaymentRequestBySeconds) {
  //   this.messagePaymentRequest = paymentRequest;
  //
  //   if (this.meetingInProgress$.value) {
  //     const currentLesson = this.conversation.lessons.find(
  //       (lesson) =>
  //         !lesson.finished &&
  //         lesson.meetingtime === this.conversation.lastmeetingtime,
  //     );
  //     const index = this.paymentRequests.findIndex(
  //       (req) => req.id === currentLesson.id,
  //     );
  //     this.paymentRequests[index] = { ...paymentRequest, id: currentLesson.id };
  //   } else {
  //     if (this.advisorId === this.currentUser().id) {
  //       // если не студент, то поменяем иконку
  //       this.sendBtnSrc = 'assets/newsfeed/send-paid.svg';
  //       this.scaleSendBtn = true;
  //     }
  //   }
  // }

  async onAnswerSendClick(message: Partial<Message>) {
    const file = message.message_screenshots[0].file;
    if (file) {
      const uploadedFile = await this.useUploader(
        file,
        'message-screenshot-' + new Date().getTime(),
      );
      message.message_screenshots = [
        { url: decodeURIComponent(uploadedFile.successful[0].uploadURL) },
      ];
    }
    this.sendMessage(message)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private async useUploader(blob: File, title: string) {
    this.uploader.addFile({
      data: blob,
      name: title,
      source: 'file input',
      type: blob.type,
    });
    const userId = this.currentUser().id;
    this.uploader.setMeta({ folder: `users/${userId}/message-screenshots` });

    const uploadedFile = await this.uploader.upload();
    this.uploader.reset();
    return uploadedFile;
  }

  reloadConversation() {
    return this.conversationsService
      .fetchConversation(this.conversation.id)
      .pipe(
        mergeMap((res) => {
          this.conversation = res;
          const id = this.currentPaymentSession?.id;
          if (
            id &&
            !this.conversation.message_payment_sessions.find((s) => s.id === id)
          ) {
            this.conversation.message_payment_sessions.push(
              this.currentPaymentSession,
            );
          }

          return this.fetchFunnelPosition() || of();
        }),
        tap(() => {
          this.updateWithoutReloading();
          this.cdRef.detectChanges();
          if (this.firstUnreadMessageId()) {
            this.scrollToMessage(this.firstUnreadMessageId());
          } else {
            this.scrollOnHistory();
          }
        }),
      );
  }

  // Определяет цвет обводки у партнера (новый/интересный/регулярный студент-адвизор)
  fetchFunnelPosition(): Observable<number | number[]> {
    if (
      this.currentUser().id === this.conversation.project?.user.id ||
      !this.conversation.project
    ) {
      return this.fetchFunnelPositionForAdvisor();
    }
    return this.fetchFunnelPositionForStudents();
  }

  fetchFunnelPositionForAdvisor() {
    return this.insightsService
      .fetchFunnelPositionForAdvisor(
        this.anonUser ? null : this.activeConversationRater()?.user_id,
      )
      .pipe(tap((res) => this.getBorderColorFromFunnel(res)));
  }

  private fetchFunnelPositionForStudents() {
    if (this.activeConversationPartners().length === 0) {
      return of();
    }
    return forkJoin(
      this.activeConversationPartners().map((partner) =>
        this.insightsService.fetchFunnelPositionForStudent(partner.user_id),
      ),
    ).pipe(
      tap((responses) =>
        responses.forEach((res) => this.getBorderColorFromFunnel(res)),
      ),
    );
  }

  private getBorderColorFromFunnel(funnel: number): void {
    const colors = {
      1: '#00AFFE',
      2: '#E3BE30',
      3: '#00C67E',
    };

    this.borderColor = colors[funnel] || '#E9E9E9';

    this.funnelNumber = funnel;
    this.companionTypeName.set(
      this.advisorId === this.currentUser().id
        ? this.funnelStudentNames[funnel]
        : this.funnelAdvisorNames[funnel],
    );
  }

  // Список оплат в этом диалоге
  parsePaymentRequests() {
    this.conversation.lessons.forEach((lesson) => {
      const index = this.paymentRequests.findIndex(
        (req) => req.id === lesson.id,
      );

      const request: LessonPaymentRequset = {
        id: lesson.id,
        ...lesson.payment_request,
      };
      request.paymentrequestapproved = lesson.paymentrequestapproved;
      request.paymentrequestdenied = lesson.paymentrequestdenied;
      if (index !== -1) {
        this.paymentRequests[index] = request;
      } else {
        this.paymentRequests.push(request);
      }
    });
  }

  scrollOnHistory(bottom: boolean = true) {
    timer(100)
      .pipe(take(1))
      .subscribe(() => {
        const history = this.chatHistoryRef?.nativeElement;
        history?.scrollTo({ top: bottom ? history.scrollHeight : 0 });
      });
  }

  getPaymentRequest(id: number) {
    return this.paymentRequests.find((req) => req.id === id);
  }

  public replyToYesNoQuestion(option: { id: number; text: string }) {
    const message: Message = {
      conversation_id: this.conversation.id,
    };
    message.user_id = this.currentUser().id;
    message.user = this.currentUser();
    message.initial_message_id = this.confirmationPanelData().questionId;
    message.body = option.text;

    return this.messagesService
      .createMessage(message)
      .pipe(
        tap((res: Message) => {
          this.messagePaymentRequest = null;
          this.messageToAnswer = null;
          this.showConfirmationPanel.set(false);
          this.confirmationPanelData.set(null);

          this.messageSentEvt.emit();
          setTimeout(() => this.scrollOnHistory());
          this.firstUnreadMessageId.set(null);
        }),
      )
      .subscribe(() => {
        this.conversationsService.clearSpecialMessage();
        this.clearMessageToAnswer();
      });
  }

  // Отправка сообщения, вызывается по клику на "отправить"
  protected sendMessage = (fields: { [field: string]: any }) => {
    // Проверка на обязательные поля
    if (
      !fields.body &&
      !fields.audio_message &&
      !fields.attachment &&
      !fields.special &&
      !fields.message_screenshots
    ) {
      return;
    }

    // Добавление полей в сообщение
    const message: Message = {
      conversation_id: this.conversation.id,
    };
    message.user_id = this.currentUser().id;
    message.user = this.currentUser();
    Object.keys(fields).forEach((field) => (message[field] = fields[field]));

    // Если это ответ на другое сообщение
    if (this.messageToAnswer) {
      message.initial_message_id = this.messageToAnswer.id;
    }

    // Делает сообщение платным (платное если есть paymentrequestamount)
    if (
      this.messagePaymentRequest &&
      this.messagePaymentRequest.advisor_income > 0
    ) {
      message.paymentrequestamount =
        this.messagePaymentRequest.advisor_income * 100;
      message.paymentrequesttime =
        this.messagePaymentRequest.billable_seconds ||
        this.messagePaymentRequest.due_seconds;
      message.paymentrequestapproved = false;
    }

    // Если это сессия платных сообщений
    if (this.paymentSessionOpened) {
      message.message_payment_session_id =
        this.currentPaymentSession.id ?? null;
    }

    this.conversationDidSend$.next(!this.meetingInProgress$.value);

    // Add immediately message from user to message state
    this.chatStateService.addNewMessageToChat(message);

    const createMessageObs = this.messagesService.createMessage(message).pipe(
      tap((res: Message) => {
        this.messagePaymentRequest = null;
        this.messageToAnswer = null;

        if (!message.message_payment_session_id) {
          this.conversation.messages.push(res);
          this.dialogData.push({ type: 'message', data: res });
        } else {
          const paymentSession =
            this.conversation.message_payment_sessions.find(
              (s) => s.id === this.currentPaymentSession.id,
            );

          if (!paymentSession?.messages) {
            paymentSession.messages = [];
          }
          paymentSession.messages.push(res);
        }

        this.messageSentEvt.emit();
        setTimeout(() => this.scrollOnHistory());
        this.firstUnreadMessageId.set(null);
      }),
    );

    if (
      this.isInternal() &&
      !this.conversation.members
        .map((member) => member.user_id)
        .includes(this.currentUser().id)
    ) {
      return this.conversationsService
        .addConversationMember({
          user_id: this.currentUser().id,
          conversation_id: this.conversation.id,
        })
        .pipe(
          switchMap((res) => {
            this.conversation.addMember(res.conversation_member);
            return createMessageObs;
          }),
        );
    }

    return createMessageObs;
  };

  // Когда диалог создается со страницы Creatives, она считается clarification
  // Это значит что я уточняю у автора что-то по поводу проекта
  // Когда мне все понятно, я нажимаю, что все понятно
  resolveAndCloseClarification() {
    this.conversationsService
      .markConversationAsResolved(this.conversation.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => (this.conversation.isclarification = false)),
      )
      .subscribe();
  }

  // Все понятно + добавить в review queue
  resolveAndAddToQueueClarification() {
    this.conversationsService
      .markConversationAsResolved(this.conversation.id)
      .pipe(
        mergeMap(() => this.addToQueueDidClick(this.conversation.project_id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Добавить в review queue
  addToQueueDidClick(projectID: number) {
    return this.projectService
      .addProjectToCurrentUserReviewQueue(projectID)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.currentUser().queuedprojects.push(projectID)),
        tap(() => (this.conversation.isclarification = false)),
      );
  }

  // Смена стоимости часа от лица адвизора (в правом верхнем углу)
  public onPriceChanged(value: number) {
    this.conversationsService
      .updatePrice(this.conversation.id, value)
      .pipe(
        mergeMap(() =>
          this.sendMessage({ body: `€${value}`, special: 'change_rate' }),
        ), // TODO: currency pipe
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Когда автор проекта оценивает фидбэк, к каждому комментарию можно задать вопрос
  // Вопросы будут отображаться в чате
  // У каждого вопроса к фидбэку будет значок с лупой, позволяющей этот фидбэк найти
  public findFeedback(feedback: NewsfeedFeedback) {
    this.selectFeedbackFromConversationEvt.emit(feedback);
  }

  // Ответить на сообщение
  public replyMessage(message: Message) {
    this.messageToAnswer = message;
    this.focusInput.emit();
  }

  // Открыть изначальное сообщение, на которое был ответ
  public getInitialMessage(message: Message) {
    if (!message.initial_message_id) {
      return;
    }

    return this.conversation.messages.find(
      (m) => m.id === message.initial_message_id,
    );
  }

  // Прокрутить страницу к сообщению
  public scrollToMessage(id: number, offsetValue: number = 10) {
    if (id) {
      const message =
        document.getElementById('chat-message-' + id) ||
        document.getElementById('meeting-confirmation-' + id);
      if (message) {
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (message && offsetValue) {
        setTimeout(() => {
          const scrollContainer = this.chatHistoryRef?.nativeElement;
          scrollContainer.scrollTop -= offsetValue;
        }, 500);
      }
    }
  }

  // Прокрутить страницу вниз до последнего сообщения
  scrollToLastMessage() {
    const filtered = this.conversation.messages.filter((message) =>
      shouldShowMessage(message, this.currentUser()),
    );
    const lastMessageId = filtered[filtered.length - 1].id;
    if (lastMessageId) {
      this.scrollToMessage(lastMessageId);
    }
  }

  // Сделать непрочитанные сообщения прочитанными
  scrollMessageIntoView(id: number) {
    this.messages$
      .pipe(
        take(1),
        map((messages) =>
          messages.filter((el) => el.user_id !== this.currentUser().id),
        ),
        map((inboxMessages) => {
          const selectedMessage = inboxMessages.find((el) => el.id === id);
          return selectedMessage && !selectedMessage.read
            ? selectedMessage
            : null;
        }),
        filter((selectedMessage) => !!selectedMessage),
        delay(3000),
        mergeMap((selectedMessage) => {
          selectedMessage.read = true;
          return this.messagesService.updateMessage(
            selectedMessage.id,
            selectedMessage,
          );
        }),
      )
      .subscribe();
  }

  // Отменить ответ на сообщение
  public clearMessageToAnswer() {
    this.messageToAnswer = null;
  }

  // Аудио сообщения
  public startAudioRecording() {
    this.isRecording = true;
    this.isRecordingStopped = false;
    this.isRecordingEvent.emit(this.isRecording);
  }

  public sendAudioMessage(event: {
    title: string;
    url: string;
    duration: number;
    language: string;
    name: string;
  }) {
    const tempMessage = this.chatStateService.tempMessage.get(event.name);
    const message = {
      ...(tempMessage ? tempMessage : {}),
      body: event.title,
      audio_message: {
        url: event.url,
        duration: event.duration,
        language: event.language,
      },
    };
    this.chatStateService.tempMessage.delete(event.title);
    return this.sendMessage(message).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.handleAudioSuccess()),
      catchError((err) => this.handleAudioError(err)),
    );
  }

  handleAudioSuccess() {
    this.isRecording = false;
    this.isRecordingStopped = false;
    this.isStartedUploadAudio.set(false);
    this.audioError.emit(false);
    this.isRecordingEvent.emit(this.isRecording);
  }

  private handleAudioError(err: HttpErrorResponse) {
    this.audioError.emit(true);
    return throwError(err);
  }

  public handleRecorderNotAllowed() {
    this.isRecording = false;
    this.recorderNotAllowed = true;
    this.isRecordingEvent.emit(this.isRecording);
  }

  // Что-то про сессии платных сообщений (запускаешь таймер, пишешь сообщения, и они не показвыаются студенту, пока он не заплатил)
  public createPaymentSession(): void {
    this.paymentSessionOpened = true;

    this.currentPaymentSession = new PaymentSession();
    this.currentPaymentSession.status = 'created';
    this.dialogData.push({
      type: 'paymentSession',
      data: this.currentPaymentSession,
    });

    this.conversationsService
      .createPaymentSession()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.currentPaymentSession.id = res;
        this.conversation.message_payment_sessions.push(
          this.currentPaymentSession,
        );
      });
  }

  public closePaymentSession(): void {
    if (!this.currentPaymentSession?.id) {
      return;
    }

    if (!this.currentPaymentSession.messages?.length) {
      this.currentPaymentSession = null;
      this.paymentSessionOpened = false;
      this.closeTimer$.next(false);
      this.informMessage =
        '<span style="color:#D9593C;">To invoice others, send at least one message first.</span>';
      return;
    }

    let updateBillableSeconds$: Observable<void> = of(null);
    this.informMessage = null;
    const paymentRequest = this.currentPaymentSession.payment_request;

    if (paymentRequest?.billable_seconds != null) {
      const value: Partial<PaymentRequestBySeconds> = {
        billable_seconds: paymentRequest.billable_seconds,
      };
      updateBillableSeconds$ = this.conversationsService.updatePaymentSession(
        this.currentPaymentSession.id,
        value,
      );
    }

    updateBillableSeconds$
      .pipe(
        mergeMap(() => {
          const value: Partial<PaymentSession> = {
            status: this.paymentSessionStatuses.awaitingPayment,
          };

          return this.conversationsService
            .updatePaymentSession(this.currentPaymentSession.id, value)
            .pipe(
              tap(
                () =>
                  (this.currentPaymentSession.status =
                    this.paymentSessionStatuses.awaitingPayment),
              ),
            );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.scrollOnHistory();

        this.currentPaymentSession = null;
        this.paymentSessionOpened = false;
        this.closeTimer$.next(false);
      });
  }

  public toggleTimer(value: boolean): void {
    this.paymentSessionOpened = value;
    if (!value) {
      this.sendBtnSrc = 'assets/icons/send.svg';
      this.scaleSendBtn = false;
    }
  }

  // Не хочу оплачивать
  public denySessionPayment(id: number): void {
    this._paymentProcessing$.next({ id, processing: true });

    const value = { status: this.paymentSessionStatuses.denied };

    this.conversationsService
      .updatePaymentSession(id, value)
      .pipe(
        mergeMap(() => this.sendMessage({ special: 'payment_denied' })),
        finalize(() =>
          this._paymentProcessing$.next({ id, processing: false }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Хочу оплатить, перевод денег
  public approveSessionPayment(id: number): void {
    this._paymentProcessing$.next({ id, processing: true });

    this.transactionsService
      .createPaymentIntentForSession(id)
      .pipe(
        mergeMap((res) => {
          if (res) {
            return this.showStripePaymentMethods(
              res.payment_id,
              res.client_secret,
              'paymentSession',
            );
          }

          return of(res);
        }),
        mergeMap(() => this.sendMessage({ special: 'payment_accepted' })),
        catchError((err) => {
          this.snackBar.open(err.error.error, null, {
            duration: 6000,
          });
          return throwError(err);
        }),
        finalize(() =>
          this._paymentProcessing$.next({ id, processing: false }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Оплата за видео урок
  meetingPaymentConfirm(id: number) {
    this._paymentProcessing$.next({ id, processing: true });

    this.transactionsService
      .createPaymentIntentForLessons(id)
      .pipe(
        mergeMap((res) => {
          if (res) {
            return this.showStripePaymentMethods(
              res.payment_id,
              res.client_secret,
              'lesson',
            );
          }

          return of(res);
        }),
        mergeMap(() => this.sendMessage({ special: 'payment_accepted' })),
        mergeMap(() => this.reloadConversation()),
        finalize(() =>
          this._paymentProcessing$.next({ id, processing: false }),
        ),
        catchError((err) => {
          this.snackBar.open(err.error.error, null, {
            duration: 6000,
          });
          return throwError(err);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Не хочу платить за видео урок
  meetingPaymentDeny(id: number) {
    this._paymentProcessing$.next({ id, processing: true });

    this.conversationsService
      .denyPaymentRequestForLesson(id)
      .pipe(
        mergeMap(() => this.sendMessage({ special: 'payment_denied' })),
        mergeMap(() =>
          this.reloadConversation().pipe(
            finalize(() =>
              this._paymentProcessing$.next({ id, processing: false }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // Оплата со вводом карты, если к аккаунту не привязан страйп
  showStripePaymentMethods(
    paymentId: string,
    secret: string,
    type: 'lesson' | 'paymentSession',
  ): Observable<unknown> {
    this.bankCardPayment = true;
    this.cdRef.detectChanges();

    const elements = this.stripe.elements();
    const card = elements.create('card', {
      hidePostalCode: true,
    });

    card.mount('#card-element');
    card.on('change', ({ error }) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.classList.add('active');
        displayError.textContent = error.message;
      } else {
        displayError.classList.remove('active');
        displayError.textContent = '';
      }
    });

    const form = document.getElementById('payment-form');

    return fromEvent(form, 'submit').pipe(
      tap(() => (this.bankCardPaymentInProgress = true)),
      mergeMap(() => {
        return this.stripe
          .confirmCardPayment(secret, {
            payment_method: { card },
            setup_future_usage: 'off_session',
          })
          .then((result) => {
            this.bankCardPaymentInProgress = false;

            const error = result.error;
            if (error) {
              const displayError = document.getElementById('card-errors');
              displayError.classList.add('active');
              displayError.textContent = error.message;

              return throwError(error);
            }

            this.bankCardPayment = false;
            return this.conversationsService.updatePaymentStatus(
              paymentId,
              type,
            );
          });
      }),
    );
  }

  // Оставление чаевых после оплаты
  public handleTipsActions(
    percent: number = null,
    type: string,
    id: number,
  ): void {
    this._tipsPaymentProcessing$.next({ id, processing: true });

    this.transactionsService
      .sendTipsRequest(percent, type, id)
      .pipe(
        finalize(() =>
          this._paymentProcessing$.next({ id, processing: false }),
        ),
        mergeMap(() => this.reloadConversation()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  nextIceBreakerQuestion(conversation: IceBreakerConversation): void {
    this.iceBreakerService
      .nexIcebreakerQuestion(conversation)
      .subscribe((updatedIceBreakerConversation) => {
        this.conversation = updatedIceBreakerConversation;
      });
  }

  completeIceBreaker(conversation: IceBreakerConversation): void {
    this.iceBreakerService
      .completeIcebreaker(conversation)
      .subscribe((completedIceBreakerConversation) => {
        this.conversation = completedIceBreakerConversation;
      });
  }

  editMessageOriginal(questionId: number): void {
    let questionToEdit: IceBreakerTemplateMessage;
    const foundedStep = this.conversation.icebreaker_member.questions.find(
      (step: StepQuestionTemplate) => {
        questionToEdit = step.questions.find(
          (question: IceBreakerTemplateMessage) => question.id === questionId,
        );
        if (questionToEdit) {
          return step;
        }
      },
    );
    this.dialog.open(EditIceBreakerModalComponent, {
      maxWidth: 550,
      panelClass: 'edit-ice-breaker-message-modal',
      data: {
        step: foundedStep,
        questionToEdit,
        isNewQuestions: false,
        icebreaker_id: this.conversation.icebreaker_member.icebreaker_id,
      },
    });
  }

  addNewQuestionsToIceBreaker(): void {
    this.dialog.open(EditIceBreakerModalComponent, {
      maxWidth: 550,
      panelClass: 'edit-ice-breaker-message-modal',
      data: {
        step: null,
        questionToEdit: null,
        isNewQuestions: true,
        icebreaker_id: this.conversation.icebreaker_member.icebreaker_id,
        iceBreakerTitle: this.conversation.icebreaker_member,
      },
    });
  }

  public startUpload(audioMessage): void {
    this.uploadAudioMessage(
      audioMessage.blob,
      audioMessage.title,
      audioMessage.duration,
      audioMessage.fileName,
    );
    this.isStartedUploadAudio.set(true);
    const message = {
      body: audioMessage.title,
      audio_message: {
        url: null,
        duration: audioMessage.duration,
        language: audioMessage.language,
      },
      user_id: this.currentUser().id,
      conversation_id: this.conversation.id,
    };
    this.chatStateService.addNewMessageToChat(message);
    this.chatStateService.tempMessage.set(audioMessage.fileName, message);
    this.isRecording = false;
    this.isRecordingEvent.emit(this.isRecording);
    this.scrollOnHistory();
  }

  private terminateRunningWorker(): void {
    this.sortDialogDataWorker?.terminate();
  }

  getCurrentUserInfo(): IConversationUserInfo {
    return this.activeConversationPartners().find(
      (partner) => partner.user_id === this.currentUser().id,
    );
  }

  ngOnDestroy(): void {
    this.meetingDateCheckSub?.unsubscribe();
    this.websocketService.unsubscribeFromSessions();
    this.websocketService.currentConversationId$.next(null);
    this.terminateRunningWorker();
    this.closePaymentSession();
  }

  private _subscribeOnAuthUser() {
    if (this.anonUser()) {
      this.currentUser.set(this.anonUser());
    } else {
      this.authService.authorizedUser$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((user) => {
          this.currentUser.set(user || null);
        });
    }
  }

  private loadInitialMessages() {
    if (this.chatStateService.messagesStateSnapshot.length === 0) {
      this.isLoadMoreMessages.set(true);
      this.conversationsService
        .getChatMessages(
          this.conversation.id,
          20,
          undefined,
          this.anonUser() ? this.anonUser().id : undefined,
        )
        .pipe(
          tap((messages: Message[]) => {
            this.chatStateService.addOldestMessagesToChat(messages);
            this.isLoadMoreMessages.set(false);
          }),
          catchError(() => {
            this.isLoadMoreMessages.set(false);
            return EMPTY;
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  private detectSpecialMessages(messageData: {
    messageType: MessageSpecial;
    message: Message | MessageWs;
  }) {
    if (!messageData) {
      return;
    }
    if (messageData.messageType === 'yes_no_question') {
      this.showConfirmationPanel.set(true);
      this.confirmationPanelData.set({
        questionId: messageData.message.id,
        options: messageData.message.additional_attributes,
      });
      this.setInputPlaceholder();
    }
  }

  private setInputPlaceholder() {
    if (this.showConfirmationPanel()) {
      this.inputPlaceholder.set('text_input.disabled');
    } else if (this.isInternal()) {
      this.inputPlaceholder.set('text_input.internal');
    } else {
      this.inputPlaceholder.set('text_input.client');
    }
  }

  public convertType(conversation: Conversation) {
    return returnConversationType(conversation);
  }

  public navigateBackClickHandler(): void {
    this._outletService.navigateBack();
  }
}
