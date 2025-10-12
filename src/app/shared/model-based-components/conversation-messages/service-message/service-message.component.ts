import {
  Component,
  Input,
  input,
  OnInit,
  signal,
  effect,
  output,
} from '@angular/core';
import { Message, MessageFile } from '../../../models/message.model';
import { NewsfeedFeedback } from '../../../models/newsfeedfeedback.model';
import {
  IConversationUserInfo,
  RequestType,
} from '../../../models/conversation.model';
import { MatDialog } from '@angular/material/dialog';
import { AudioRecordingService } from '../../../../services/audio-recorder';
import { isUrlString } from '../../../functions/is-url-string';
import { ViewFileComponent } from '../../../components/view-file/view-file.component';
import { BaseComponent } from '../../../components/base.component';
import { LanguageService } from '../../../../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Lesson } from '../../../models/lesson.model';
import { messageAnimation, messageListStagger } from 'src/app/shared/animations';

@Component({
  selector: 'app-service-message',
  templateUrl: './service-message.component.html',
  styleUrls: ['./service-message.component.scss'],
  animations: [messageAnimation, messageListStagger],
})
export class ServiceMessageComponent extends BaseComponent implements OnInit {
  readonly message = input.required<Message>();

  @Input() private isAdvisorsPage: boolean;
  @Input() public currentUser: any = {};
  @Input() public paymentSessionId: number;
  @Input() public feedback: NewsfeedFeedback;
  @Input() public feedbackQuestion: Message;
  @Input() icebreakerTitle = '';
  @Input() recipients: IConversationUserInfo[];
  public direction = input<'left' | 'right'>('left');
  public showUserAddDeleteMessage = signal<boolean>(false);
  public enterMeet = output<Lesson>();

  public isInternalChat = input<boolean>(false);
  public messageText: string;
  public isAuthor: boolean;

  public isRed: boolean;
  public isGreen: boolean;
  public isYellow: boolean;

  public hasLinks: boolean;
  public showSpecialMessages = signal<boolean>(false);
  youtubeEmbedVideoId = '';
  youtubeStartTime = 0;
  isLinkMessage = false;
  languages: string[] = [];
  private currentLanguage = signal<string>('en');

  constructor(
    private dialog: MatDialog,
    private audioRecordingService: AudioRecordingService,
    private readonly languageService: LanguageService,
    private readonly translateService: TranslateService,
  ) {
    super();

    effect(
      () => {
        const currentLang = this.languageService.currentLanguageCode();
        this.currentLanguage.set(currentLang);
        this.translateService.use(currentLang);

        // If message is already loaded, update the message body when language changes
        if (this.message?.()) {
          this.getMessageBody();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.detectSpecialMessages();
    this.isAuthor =
      this.message()?.user_id &&
      this.message().user_id === this.currentUser()?.id;

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
    this.isYellow = ['paid_feedback_request', 'meeting_request'].includes(
      this.message().special,
    );

    this.message().body = this.message().body || '';

    this.getMessageBody();
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

  // toDo: is this really needed?
  private detectSpecialMessages() {
    if (this.message().special === 'yes_no_question') {
      this.showSpecialMessages.set(true);
    }
  }

  private getMessageBody() {
    const additionalAttributes = this.message().additional_attributes;
    switch (this.message().special) {
      case 'change_rate':
        this.messageText = this.isAuthor
          ? `You adjusted the hourly rate to ${this.message().body} for this creative`
          : `Connector adjusted the hourly rate to ${this.message().body}`;
        break;

      case 'payment_accepted':
        this.messageText = this.isAuthor
          ? 'You accepted the payment'
          : 'Connection accepted the payment';
        break;

      case 'payment_denied':
        this.messageText = this.isAuthor
          ? 'You declined the payment'
          : 'Connection declined the payment';
        break;

      case 'meeting_accepted':
        this.messageText = this.isAuthor
          ? 'You accepted the meeting'
          : 'User accepted the meeting';
        break;

      case 'meeting_denied':
        if (this.isAdvisorsPage) {
          this.messageText = 'Request denied, please contact another advisor';
        } else {
          this.messageText = this.isAuthor
            ? 'You declined the meeting'
            : 'User declined the meeting';
        }
        break;

      case 'paid_feedback_request':
        this.messageText = 'Paid feedback request';
        break;

      case 'meeting_request':
        this.messageText = this.isAuthor
          ? 'You requested a meeting'
          : 'User requested a meeting';
        break;

      //toDo: change yes_no_question to message_type
      case 'yes_no_question':
        const bodyString: string = this.message().body;
        const regex = new RegExp(`${this.currentLanguage()}:\\s*'([^']*)'`);
        const match = bodyString.match(regex);
        const localizedText = match[1];
        this.messageText = localizedText;
        break;

      case 'approve_counsellor_question':
        // TODO: add a translation here
        this.messageText =
          'Do you accept ' +
          additionalAttributes?.counsellor_name +
          ' as your coordinator?';
        break;

      case 'case_taken':
        // Use translation key for coordinator message
        this.messageText =
          additionalAttributes?.counsellor_name +
          this.translateService.instant(
            'conversation.service_message.case_taken',
          );
        break;

      case 'request_type_changed':
        const requestType = additionalAttributes?.user?.request_type;
        const consultantName = additionalAttributes?.user?.user_name;
        const organizationName = additionalAttributes?.user?.organization_name;
        if (requestType === RequestType.ORGANIZATION_DIRECT) {
          this.messageText = this.translateService.instant(
            'conversation.service_message.shared_with_organization',
            {
              consultantName,
              organizationName,
            },
          );
        } else {
          this.messageText = this.translateService.instant(
            'conversation.service_message.shared_with_platform',
            {
              consultantName,
            },
          );
        }
        break;

      case 'member_added':
        this.messageText = null;
        this.showUserAddDeleteMessage.set(true);
        break;

      case 'member_removed':
        this.messageText = null;
        this.showUserAddDeleteMessage.set(true);
        break;

      default:
        if (isUrlString(this.message().body)) {
          this.isLinkMessage = true;
        }
        this.messageText = this.message().body.replace(
          /(((https?:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g,
          (match) => {
            const trimmed =
              match.length > 40 ? match.slice(0, 40) + '...' : match;
            this.hasLinks = true;
            this.youtubeEmbedVideoId = this.getYoutubeVideoId(match);
            if (this.youtubeEmbedVideoId) {
              this.youtubeStartTime = this.getYoutubeTime(match);
              return `<a href="${match}" title="${match}" target="_blank">${trimmed}</a>`;
            }
            return `<a href="${match}" title="${match}" target="_blank">${trimmed}</a>`;
          },
        );
        break;
    }
  }

  public onEnterClasroomClick($event) {
    this.enterMeet.emit($event);
  }
}
