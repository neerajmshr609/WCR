import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {
  Conversation,
  IConversationUserInfo,
} from 'src/app/shared/models/conversation.model';
import { formatDistance, max, parseISO } from 'date-fns';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  FunnelAdvisorNames,
  FunnelColors,
  FunnelStudentNames,
} from 'src/app/shared/enums/funnel';
import makeUrl, { TCalendarEvent } from 'add-event-to-calendar';
import { addHours } from 'date-fns';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  styleUrls: ['./conversation-item.component.scss'],
})
export class ConversationItemComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('conversationBodyRef') conversationBodyRef: ElementRef;
  @ViewChild('conversationLeftRef') conversationLeftRef: ElementRef;

  @Input() conversation: Conversation;
  @Input() type: string;
  @Input() funnelNumber: number;
  @Input() feedbackPath$: BehaviorSubject<string>;
  @Input() currentUser: User;

  linkRoute: string;
  widthProjectInfo: number;
  style: any;
  sumType = 1;
  funnelStudent: any = FunnelStudentNames;
  funnelAdvisor: any = FunnelAdvisorNames;

  public conversationPartner: IConversationUserInfo;
  public readonly funnelColors = FunnelColors;

  public lastActivityTime: string;

  public calendars = [
    {
      displayName: 'conversation_item.calendars_menu.google',
      linkKey: 'google',
      icon: 'assets/calendars/icon-google.svg',
      url: '',
    },
    {
      displayName: 'conversation_item.calendars_menu.outlook',
      linkKey: 'outlook',
      icon: 'assets/calendars/icon-outlook.svg',
      url: '',
    },
    {
      displayName: 'conversation_item.calendars_menu.apple',
      linkKey: 'ics',
      icon: 'assets/calendars/icon-apple.svg',
      url: '',
      hidden: true,
    },
  ];

  private today = new Date();

  @HostListener('window:resize') onResize() {
    this.setConversationHeaderWidth();
  }

  constructor(
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  private getDistance(date: Date): string {
    return formatDistance(date, this.today, { addSuffix: true });
  }

  private getMaxDate(dates: string[]) {
    return max(dates.filter((d) => d).map((d) => parseISO(d)));
  }

  private getLastActivityTime(): string {
    const lessonsDates =
      this.conversation.lessons?.flatMap((l) => [
        l.created_at,
        l.start,
        l.end,
      ]) || [];
    const sessionsDates =
      this.conversation.message_payment_sessions?.flatMap((s) => [
        s.created_at,
        s.last_message_date,
      ]) || [];

    const creationDate =
      this.conversation.created_at || this.conversation.rating_created;

    const lastInteractionTime = this.getMaxDate([
      ...lessonsDates,
      ...sessionsDates,
      this.conversation.last_message_time,
      creationDate,
    ]);

    return this.getDistance(lastInteractionTime);
  }

  // TODO reworked on WCR-293

  // private getCalendarLinks(): void {
  //   if (!this.conversation.recipient) {
  //     return;
  //   }

  //   const currentUserId = this.authService.userSubject$.value?.id;
  //   const sender = this.conversation.sender;

  //   const userName = this.conversation.recipient_id === currentUserId ? (sender.username || `User#${this.conversation.sender_id}`) : (this.conversation.recipient.username || `User#${this.conversation.recipient_id}`);

  //   let details = '';

  //   const conversationProject = this.conversation.project;
  //   if (conversationProject) {
  //     details += `Project: ${conversationProject.title || 'Untitled'} \nProject description: ${conversationProject.description || 'empty'} \n`;
  //   } else {
  //     details += 'No project \n';
  //   }

  //   if (this.conversation.conversation_userskill) {
  //     details += `Skill: ${this.conversation.conversation_userskill.skill.name}`;
  //   }
  //   const origin = window.location.origin;
  //   const event: TCalendarEvent = {
  //     name: `Meeting with ${userName} from getme.global`,
  //     location: `https://getme.global/conversations/${this.conversation.id}`,
  //     details,
  //     startsAt: new Date(this.conversation.lastmeetingtime).toISOString(),
  //     endsAt: addHours(new Date(this.conversation.lastmeetingtime), 1).toISOString(),
  //   };

  //   const eventUrls = makeUrl(event);
  //   this.calendars.forEach(item => (item.url as SafeUrl) = this.domSanitizer.bypassSecurityTrustUrl(eventUrls[item.linkKey]));
  // }

  private setConversationPartner(): void {
    const members = this.conversation.members;
    if (members?.length < 3) {
      members.forEach((member) => {
        if (member.user_id !== this.currentUser.id) {
          this.conversationPartner = member;
        }
      });
    }
  }

  ngOnInit(): void {
    this.lastActivityTime = this.getLastActivityTime();
    // this.getCalendarLinks();
    this.setConversationPartner();
  }

  private setConversationHeaderWidth() {
    const conversationBodyWidth: number =
      this.conversationBodyRef.nativeElement.getBoundingClientRect().width;
    const conversationLeftWidth: number =
      this.conversationLeftRef.nativeElement.getBoundingClientRect().width;
    const paddingWidth = 32;

    this.widthProjectInfo =
      conversationBodyWidth - paddingWidth - conversationLeftWidth;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.setConversationHeaderWidth();
  }
}
