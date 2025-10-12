import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { User } from 'src/app/shared/models/user.model';
import { ProjectService } from 'src/app/services/project.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Conversation } from 'src/app/shared/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from 'src/app/shared/models/message.model';
import { AuthService } from 'src/app/auth/auth.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { MatDialog } from '@angular/material/dialog';
import { CreativesWarningModalComponent } from '../creatives-warning-modal/creatives-warning-modal.component';

@Component({
  selector: 'app-creatives-project-card',
  templateUrl: './creatives-project-card.component.html',
  styleUrls: ['./creatives-project-card.component.scss'],
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
export class CreativesProjectCardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('presentationNavRef') presentationNavRef: ElementRef;

  @Input() currentUser: User;
  @Input() author: User;
  @Input() project: Project;
  @Input() disabled: boolean;

  @Output() addToQueueDidClickEvent = new EventEmitter<number>();
  @Output() removeFromQueueDidClickEvent = new EventEmitter<number>();
  @Output() firstInQueue = new EventEmitter<number>();

  selectedFileImageView$ = new BehaviorSubject<Projectfile>(null);
  isSingleFileProject: boolean;

  feedbackChatMessageSaving: boolean;
  feedbackChatMessageSaved: boolean;
  savedMessage: Message;

  public horizontalSlider: Flickity;
  public slidesCount: number;
  public selectedDisplayType = 'grid';
  public selectedFile: Projectfile;
  public isFileInfoOpen: boolean;

  public messageSentEvt = new EventEmitter<void>();

  public draftId: number;

  constructor(
    private conversationsService: ConversationsService,
    private projectService: ProjectService,
    private messagesService: MessagesService,
    private rateflowService: RateflowService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.rateflowService.draftsFetched$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => {
          const draft = this.rateflowService.fetchedDrafts.find(
            (d) => d.project_id === this.project.id,
          );
          this.draftId = draft?.id;
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.isSingleFileProject = this.project.projectfiles.length === 1;

    this.slidesCount =
      this.project.projectfiles.length === 1
        ? 2
        : this.project.projectfiles.length + 1;
    this.initSliders();
  }

  initSliders() {
    this.horizontalSlider = new Flickity(
      this.presentationNavRef.nativeElement,
      {
        setGallerySize: false,
        contain: true,
        draggable: true,
        pageDots: false,
        prevNextButtons: false,
      },
    );

    const onSelect = function (event, pointer, cellElement, cellIndex) {
      const prevFileId = this.selectedFile?.id;
      let index;

      if (event !== undefined && typeof event !== 'number') {
        index = cellIndex;
      } else {
        index = event;
      }

      if (index === undefined) {
        return;
      }

      this.selectedFile = null;
      if (index === 0) {
        this.selectedDisplayType = 'grid';
      } else if (index === 1) {
        this.selectedDisplayType = 'concept';
      } else {
        this.selectedDisplayType = 'file';
        this.selectedFile = this.project.projectfiles[index - 2];
        this.selectedFileImageView$.next(null);
        this.selectedFileImageView$.next(this.selectedFile);
      }

      if (this.selectedFile?.id === prevFileId) {
        this.toggleFileInfo(true);
      }
    }.bind(this);

    this.horizontalSlider.on('staticClick', onSelect);
    this.horizontalSlider.on('change', onSelect);

    if (this.isSingleFileProject) {
      this.horizontalSlider.select(2);
    }

    this.cdRef.detectChanges();
  }

  onChatMessageSendClick(event) {
    this.feedbackChatMessageSaving = true;

    this.conversationsService
      .createClarificationConversation(
        this.currentUser.id,
        this.project.user.id,
        this.project.id,
      )
      .pipe(
        switchMap((conversation: Conversation) => {
          const message: Message = {
            conversation_id: conversation.id,
            user_id: this.currentUser.id,
            body: event.body,
            audio_message: event.audio_message,
          };

          return this.messagesService.createMessage(message);
        }),
        finalize(() => (this.feedbackChatMessageSaving = false)),
        takeUntil(this.destroyed),
      )
      .subscribe((res: Message) => {
        this.messageSentEvt.emit();
        this.feedbackChatMessageSaved = true;
        this.savedMessage = res;
      });
  }

  addToQueueDidClick() {
    this.projectService
      .addProjectToCurrentUserReviewQueue(this.project.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.currentUser.queuedprojects.push(this.project.id);
      });
  }

  removeFromQueueDidClick() {
    this.projectService
      .removeProjectFromCurrentUserReviewQueue(this.project.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.currentUser.queuedprojects = [
          ...this.currentUser.queuedprojects.filter(
            (obj) => obj !== this.project.id,
          ),
        ];
        this.removeFromQueueDidClickEvent.emit(this.project.id);
      });
  }

  signupDidClick() {
    this.router.navigate(['/auth']);
  }

  setQueue() {
    this.projectService.setFirstInQueue(this.project.id).subscribe();
    this.firstInQueue.emit(this.project.id);
  }

  public toggleFileInfo(isToggle?: boolean) {
    if (!isToggle) {
      this.isFileInfoOpen = false;
      return;
    }

    this.isFileInfoOpen = !this.isFileInfoOpen;
  }

  public deleteDraft() {
    this.rateflowService
      .deleteDraft(this.draftId, this.project.id)
      .pipe(tap(() => (this.draftId = null)))
      .subscribe();
  }

  public openModal() {
    this.dialog.open(CreativesWarningModalComponent, {
      autoFocus: false,
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'reduced-padding-10',
    });
  }
}
