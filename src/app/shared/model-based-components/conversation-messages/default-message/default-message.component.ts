import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  input,
  model,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ConnectedPosition,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import {
  Message,
  MessageFile,
  MessageSpecial,
} from '../../../models/message.model';
import { NewsfeedFeedback } from '../../../models/newsfeedfeedback.model';
import { IConversationUserInfo } from '../../../models/conversation.model';
import { MessagesService } from '../../../../services/messages.service';
import { ProjectService } from '../../../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { AudioRecordingService } from '../../../../services/audio-recorder';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { ViewFileComponent } from '../../../components/view-file/view-file.component';
import { BaseComponent } from '../../../components/base.component';
import * as FileSaver from 'file-saver';
import { LanguageService } from '../../../../services/language.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../auth/auth.service';
import { getRandomAvatarSrc } from '../../../../pages/usersettings/constants/avatars';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/ru';
import 'moment/locale/uk';
import { messageAnimation, messageListStagger } from 'src/app/shared/animations';

@Component({
  selector: 'app-default-message',
  templateUrl: './default-message.component.html',
  styleUrls: ['./default-message.component.scss'],
  animations: [messageAnimation, messageListStagger],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultMessageComponent extends BaseComponent implements OnInit {
  // Add   this computed property to the component class
  readonly formattedTimeAgo = computed(() => {
    // Get the language directly from the service
    const lang = this.languageService.currentLanguageCode();
    // Set moment locale
    moment.locale(lang);
    // Format the time
    return moment(this.message().created_at).fromNow();
  });
  readonly message = input.required<Message>();
  readonly currentUser = toSignal(this._authService.authorizedUser$);
  readonly isMessageOwner = computed(() => {
    return this.message().user_id === this.currentUser()?.id;
  });

  @ViewChild('audioRef') audioRef: ElementRef;

  @Input() private isAdvisorsPage: boolean;
  @Input() public isRater: boolean;
  @Input() public paymentSessionId: number;
  @Input() public canReply: boolean;
  @Input() public canEdit: boolean;

  @Input() public feedback: NewsfeedFeedback;
  @Input() public feedbackQuestion: Message;
  @Input() public allowCopyMessage: boolean;
  @Input() public initialMessage: Message;
  @Input() icebreakerTitle = '';

  @Input() recipients: IConversationUserInfo[];
  @Input() type: 'message' | 'pqa' = 'message';
  @Input() pqaId: number;
  public direction = input<'left' | 'right'>('left');

  @Output() public find = new EventEmitter<NewsfeedFeedback>();
  @Output() public reply = new EventEmitter<void>();
  @Output() public edit = new EventEmitter<number>();
  @Output() public scrollToInitialMessage = new EventEmitter<void>();
  @Output() public delete = new EventEmitter<Message | null>();
  public isInternalChat = input<boolean>(false);
  public copied: boolean;
  public messageText: string;

  public isAuthor: boolean;

  public isRed: boolean;
  public isGreen: boolean;
  public isYellow: boolean;

  public hasLinks: boolean;
  youtubeEmbedVideoId = '';
  youtubeStartTime = 0;
  isLinkMessage = false;

  showReplyMenu = false;
  languages: string[] = [];
  private currentLanguage = signal<string>('en');
  public initialReplyText = signal<string>(null);
  public initialMessageType = signal<MessageSpecial>('regular');
  readonly avatarSrc = computed(() => {
    const message = this.message();
    return message?.user?.image || getRandomAvatarSrc(message.user_id);
  });
  readonly positions: ConnectedPosition[] = [
    new ConnectionPositionPair(
      { originX: 'end', originY: 'center' },
      { overlayX: 'end', overlayY: 'center' },
    ),
  ];

  // readonly recipientPositionsReplyMenu = [
  //   new ConnectionPositionPair({originX: 'start', originY: 'bottom'},
  //     {overlayX: 'start', overlayY: 'center'})
  // ];
  readonly recipientPositionsReplyMenu = [
    new ConnectionPositionPair(
      { originX: 'start', originY: 'center' },
      { overlayX: 'start', overlayY: 'center' },
    ),
  ];

  constructor(
    private messagesService: MessagesService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private audioRecordingService: AudioRecordingService,
    private readonly languageService: LanguageService,
    private readonly _authService: AuthService,
  ) {
    super();
    effect(
      () => {
        const currentLanguage = this.languageService.currentLanguageCode();
        this.currentLanguage.set(currentLanguage);
        this.detectSpecialMessagesForReply();
        moment.locale(currentLanguage);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    // we have 2 types of messages: loaded initially in the conversation and received via websocket
    // for the first type we have user object, for the second type we have only user_id
    this.isAuthor = this.isMessageOwner();

    this.detectSpecialMessagesForReply();

    const availableLanguages = this.recipients
      ?.map((recipient) => recipient?.lang)
      .join(',');
    this.languages =
      this.audioRecordingService.createArrayOfAvailableLanguages(
        availableLanguages,
      );

    this.isRed = ['change_rate', 'meeting_denied', 'payment_denied'].includes(
      this.message().special,
    );
    this.isGreen = ['meeting_accepted', 'payment_accepted'].includes(
      this.message().special,
    );
    this.isYellow = [
      'paid_feedback_request',
      'meeting_request',
      'personal_info',
    ].includes(this.message().special);

    this.message().body = this.message().body || '';

    this.messageText = this.message().body.replace(
      /(((https?:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g,
      (match) => {
        const trimmed = match.length > 40 ? match.slice(0, 40) + '...' : match;
        this.hasLinks = true;
        this.youtubeEmbedVideoId = this.getYoutubeVideoId(match);
        if (this.youtubeEmbedVideoId) {
          this.youtubeStartTime = this.getYoutubeTime(match);
          return `<a href="${match}" title="${match}" target="_blank">${trimmed}</a>`;
        }
        return `<a href="${match}" title="${match}" target="_blank">${trimmed}</a>`;
      },
    );
  }

  public copyMessage() {
    this.messagesService.copiedMessage = this.message();
    this.copied = true;
  }

  public onAudioMsgLangChange(language: string): void {
    this.message().audio_message.language = language;

    let request$: Observable<unknown>;

    switch (this.type) {
      case 'message':
        request$ = this.messagesService.updateMessage(this.message().id, {
          audio_message: this.message().audio_message,
        });
        break;
      case 'pqa':
        request$ = this.projectService.updatePQAnswer(this.pqaId, {
          audio_message: this.message().audio_message,
        });
        break;
      default:
        throw new Error('Invalid type');
    }

    request$.pipe(takeUntil(this.destroyed)).subscribe();
  }

  public deleteMessage() {
    this.messagesService.deleteMessage(this.message().id).subscribe();
  }

  public softDeleteMessage(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '92vw',
      maxWidth: '900px',
      height: '300px',
      panelClass: 'remove-message-modal',
      data: {
        message:
          'You are permanently deleting this message for everyone in the chat.',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) =>
          result
            ? this.messagesService.softDeleteMessage(this.message())
            : of(null),
        ),
      )
      .subscribe((result) => {
        this.showReplyMenu = false;
        this.delete.emit(result);
      });
  }

  editMessage(): void {
    this.edit.emit(this.message().icebreaker_question_id);
  }

  public openFile(file: MessageFile): void {
    if (file.loadState !== 0) {
      this.dialog.open(ViewFileComponent, {
        maxWidth: '92vw',
        maxHeight: '92vh',
        autoFocus: false,
        minWidth: '320px',
        panelClass: 'modal',
        data: file,
      });
    }
  }

  public downloadFile(file: MessageFile): void {
    FileSaver.saveAs(file.url, file.name);
  }

  private getYoutubeVideoId(url: string): string {
    let id: Array<string>;
    const formattedUrl = url
      .replace(/(>|<)/gi, '')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (formattedUrl[2]) {
      id = formattedUrl[2].split(/[^0-9a-z_\-]/i);
      return id[0];
    }

    return null;
  }

  private getYoutubeTime(url: string): number {
    const regex = /(\?t|&start)=(\d+)/;
    const match = url.match(regex);
    if (match) {
      return +match[2];
    }
    return 0;
  }

  private detectSpecialMessagesForReply() {
    if (this.initialMessage) {
      if (this.initialMessage.special === 'yes_no_question') {
        const bodyString: string = this.initialMessage.body;
        const regex = new RegExp(`${this.currentLanguage()}:\\s*'([^']*)'`);
        const match = bodyString.match(regex);
        this.initialReplyText.set(match[1]);
        this.initialMessageType.set('yes_no_question');
      }
    }
  }
}
