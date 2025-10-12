import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MessagesService } from 'src/app/services/messages.service';
import { User } from 'src/app/shared/models/user.model';
import { Project } from 'src/app/shared/models/project.model';
import { UserSkill } from 'src/app/shared/models/UserSkill.model';
import { UntypedFormControl } from '@angular/forms';
import moment from 'moment';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { MatDialog } from '@angular/material/dialog';
import { Conversation } from 'src/app/shared/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';
import { AudioMessage, Message } from 'src/app/shared/models/message.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { SelectedWithoutSkillErrorModalComponent } from '../../selected-without-skill-error-modal/selected-without-skill-error-modal.component';
import { AuthService } from '../../../../auth/auth.service';
import { OnboardingModalComponent } from '../../../../shared/components/onboarding-modal/onboarding-modal.component';

interface TimeSelection {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-skill-card-request',
  templateUrl: './skill-card-request.component.html',
  styleUrls: ['./skill-card-request.component.scss'],
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
  ],
})
export class SkillCardRequestComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @ViewChild('chat') chat: ElementRef;
  @ViewChild('inputRef') inputRef: ElementRef;

  @Input() currentUser: User;
  @Input() advisor: User;
  @Input() currentUserProjects: Project[];
  @Input() selectedSkillUpdated$: BehaviorSubject<UserSkill>;
  @Input() selectedSkillChanged$: BehaviorSubject<UserSkill>;
  @Input() conversation: Conversation;

  @Output() conversationCreated = new EventEmitter<Conversation>();

  selectedSkill: UserSkill;
  times: TimeSelection[] = [
    { value: 9, viewValue: '9:00' },
    { value: 10, viewValue: '10:00' },
    { value: 11, viewValue: '11:00' },
    { value: 12, viewValue: '12:00' },
    { value: 13, viewValue: '13:00' },
    { value: 14, viewValue: '14:00' },
    { value: 15, viewValue: '15:00' },
    { value: 16, viewValue: '16:00' },
    { value: 17, viewValue: '17:00' },
    { value: 18, viewValue: '18:00' },
    { value: 19, viewValue: '19:00' },
    { value: 20, viewValue: '20:00' },
    { value: 21, viewValue: '21:00' },
    { value: 22, viewValue: '22:00' },
    { value: 23, viewValue: '23:00' },
  ];

  feedbackChatMessageSaving = false;
  feedbackChatMessageSaved = false;

  availableHours;

  selectedTime = new UntypedFormControl();
  selectedDate = new UntypedFormControl();

  selectedProject: Project;
  messageText: string;
  datetimeSelected = false;
  messageSent = false;

  messages = new Array<Message>();

  conversationID: number;

  public isRecording: boolean;
  public isBlink = true;
  public instantMeeting: boolean;
  public audioMessage: AudioMessage;

  public stopRecordingEvt = new EventEmitter<void>();
  public messageSentEvt = new EventEmitter<void>();
  isAuth$: Observable<User> = this.authService.userSubject$;
  isShowDatePicker = false;

  constructor(
    private rateflowService: RateflowService,
    private conversationsService: ConversationsService,
    private websocketService: WebsocketService,
    private dialog: MatDialog,
    private authService: AuthService,
    public messagesService: MessagesService,
  ) {
    super();
  }

  public get requestInputTitle(): string {
    if (!this.selectedSkill) {
      return '<b>Select skill</b> you want to discuss';
    }

    if (this.selectedProject === null) {
      return 'Contact without project';
    }
    if (this.selectedProject) {
      return this.selectedProject.title || 'Untitled';
    }

    return '<b>Select project</b> you want to discuss';
  }

  ngOnChanges() {
    this.selectedProject = this.currentUserProjects?.length ? undefined : null;
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const day = (d || new Date()).getDay();
    const days = this.advisor.rulesets.length
      ? this.advisor.rulesets[0].weekdays.map((weekDay: number) => {
          const newDay = weekDay + 1;
          if (newDay === 7) {
            return 0;
          }
          return newDay;
        })
      : [];
    return days.includes(day) && d.getDate() >= new Date().getDate()
      ? 'available-date-class'
      : '';
  };

  calendarFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let days = [];

    if (this.advisor.rulesets.length) {
      // let itemDay: number[];
      // this.advisor.rulesets.map(obj => {
      //   itemDay = obj.weekdays;
      // });
      // days = itemDay;
      days = this.advisor.rulesets[0].weekdays.map((weekDay: number) => {
        const newDay = weekDay + 1;
        if (newDay === 7) {
          return 0;
        }
        return newDay;
      });
    }
    return days.includes(day) && d?.getDate() >= new Date().getDate();
  };

  onChatMessageKeyDown(input: HTMLElement) {
    input.innerText = '';
    if (this.messageText) {
      input.innerText = this.messageText;
    }
  }

  onChatMessageKeyupUpdate(input: HTMLElement) {
    const inputText = input.innerText;
    this.messageText = inputText;
  }

  getAvailableHours() {
    if (this.selectedDate.value && this.advisor.rulesets.length) {
      const ruleset = this.advisor.rulesets[0];
      const timeFrom = +ruleset.time_from.split(':')[0];
      const timeUntil = +ruleset.time_until.split(':')[0];
      const daytimes = [];

      for (let index = timeFrom; index <= timeUntil; index++) {
        daytimes.push({ value: index, viewValue: `${index}:00` });
      }

      this.availableHours = daytimes;
      return;
    }

    this.availableHours = this.times;
  }

  setInitialDate() {
    this.getAvailableHours();
    if (this.advisor.online && this.availableHours) {
      this.selectedDate.setValue(new Date());
      this.selectedTime.setValue(new Date().getHours());
      this.availableHours.unshift({
        value: new Date().getHours(),
        viewValue: moment().format('HH:mm'),
      });
    }
  }

  ngOnInit(): void {
    this.selectedSkillUpdated$
      .pipe(takeUntil(this.destroyed))
      .subscribe((skill) => {
        this.selectedSkill = skill;
        this.setInitialDate();
      });

    this.selectedSkillChanged$
      .pipe(takeUntil(this.destroyed))
      .subscribe((skill) => {
        this.selectedSkill = skill;
        this.setInitialDate();
      });

    this.subscribeToMessages();
    this.subscribeToDateInput();

    this.rateflowService.audioRecordingStarted$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res: any) =>
            res.type === 'advisors' && res.order !== this.advisor.id,
        ),
        tap(() => this.stopRecordingEvt.emit()),
      )
      .subscribe();
  }

  subscribeToDateInput() {
    this.selectedDate.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.getAvailableHours();
        this.selectedTime.setValue(null);
      });
  }

  subscribeToMessages() {
    this.websocketService.newMessage$
      .pipe(
        filter((res) => !!res),
        filter((res: any) => res.conversation_id === this.conversation?.id),
        switchMap((res: any) =>
          forkJoin({
            message: this.messagesService.getMessage(res.id),
            updated: of(res.updated),
          }),
        ),
        switchMap((res: { message: Message; updated: boolean }) => {
          if (res.updated) {
            return of(res.message);
          }
          return this.messagesService.markMessageRead(res.message.id);
        }),
        takeUntil(this.destroyed),
      )
      .subscribe((res: Message) => {
        const index = this.messages.findIndex((m) => m.id === res.id);
        if (index !== -1) {
          this.messages[index] = res;
          return;
        }

        this.messages.push(res);
        if (
          res.special === 'meeting_accepted' ||
          res.special === 'meeting_denied'
        ) {
          this.isBlink = false;
        }
        if (res.special === 'meeting_accepted') {
          this.instantMeeting = true;
        }
        setTimeout(() =>
          this.chat.nativeElement.scrollTo({
            top: this.chat.nativeElement.scrollHeight,
          }),
        );
      });
  }

  didSelectProject(project: Project) {
    if (!this.selectedSkill) {
      this.selectWithoutSkill();
      return;
    }
    this.selectedProject = project;

    if (this.advisor.online) {
      this.selectedDate.setValue(new Date());
      this.selectedTime.setValue(new Date().getHours());
      this.availableHours.unshift({
        value: new Date().getHours(),
        viewValue: moment().format('HH:mm'),
      });
    }
  }

  selectWithoutSkill() {
    if (!this.selectedSkill) {
      this.dialog.open(SelectedWithoutSkillErrorModalComponent, {
        maxWidth: '350px',
        width: '92vw',
        maxHeight: '547px',
        height: '92vh',
        autoFocus: false,
        panelClass: 'modal',
      });
    }
  }

  showDatePicker(): void {
    this.isShowDatePicker = true;
  }

  sendRequest(event: Partial<Message>) {
    if (!this.authService.userIsSignedIn()) {
      this.dialog.open(OnboardingModalComponent, {
        maxWidth: '92vw',
        width: '360px',
        height: '760px',
        maxHeight: '92vh',
        autoFocus: false,
        panelClass: 'modal',
        data: { step: 5 },
      });
      return;
    }
    const date = this.selectedDate.value || new Date();
    date.setHours(this.selectedTime.value);
    this.selectedDate.setValue(date, { emitEvent: false });

    this.feedbackChatMessageSaving = true;

    const projectID = this.selectedProject ? this.selectedProject.id : null;

    this.conversationsService
      .createTutotingRequestConversation(
        this.currentUser.id,
        this.advisor.id,
        projectID,
        this.selectedSkill,
        this.selectedSkill.rate,
      )
      .pipe(
        switchMap((res: Conversation) => {
          this.conversationCreated.emit(res);
          this.conversationID = res.id;
          return this.conversationsService.createTutotingRequestLesson(
            this.conversationID,
            this.currentUser.id,
            this.advisor.id,
            this.selectedDate.value.toISOString(),
          );
        }),
        switchMap(() => this.send(event)),
        finalize(() => (this.feedbackChatMessageSaving = false)),
        takeUntil(this.destroyed),
      )
      .subscribe(() => {
        this.feedbackChatMessageSaved = true;
      });
  }

  send(event: Partial<Message>) {
    const message: Message = {
      user_id: this.currentUser.id,
      conversation_id: this.conversation.id,
      special: this.advisor.online ? 'instant_feedback_request' : null,
      ...event,
    };

    return this.messagesService.createMessage(message).pipe(
      tap((res: Message) => {
        this.messages.push(res);
        this.messageSentEvt.emit();
      }),
    );
  }

  sendMessage(event: Partial<Message>) {
    this.send(event).pipe(takeUntil(this.destroyed)).subscribe();
  }

  public startAudioRecording() {
    this.isRecording = true;
    this.rateflowService.audioRecordingStarted = {
      order: this.advisor.id,
      type: 'advisors',
    };
  }

  public audioMessageUploaded(event: { url: string; duration: number }) {
    this.audioMessage = event;
    this.isRecording = false;
  }

  public deleteAudioMessage() {
    this.audioMessage = null;
    this.isRecording = false;
  }

  public insertExplanation() {
    const message = this.messagesService.copiedMessage;
    this.messageText = message.body;
    this.audioMessage = message.audio_message;
    this.inputRef.nativeElement.innerText = this.messageText;
  }
}
