import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { BehaviorSubject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { finalize, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { InsightsChannelEnum } from 'src/app/shared/enums';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Project } from 'src/app/shared/models/project.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { AdvisorsService } from 'src/app/services/advisors.service';
import { Conversation } from 'src/app/shared/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';
import { InsightsService } from 'src/app/services/insights.service';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from '../../models/message.model';
import { Projectfile } from '../../models/projectfile.model';
import { ProjectService } from 'src/app/services/project.service';

interface AllFeedbacksObject {
  concept?: FeedbacksForType;
  resort?: NewsfeedFeedback[];
  grid?: FeedbacksForType;
  [fileId: number]: FeedbacksForType;
}

interface FeedbacksForType {
  strengthsItems: NewsfeedFeedback[];
  weaknessesItems: NewsfeedFeedback[];
  nextstepsItems: NewsfeedFeedback[];
  linksItems: NewsfeedFeedback[];
}

@Component({
  selector: 'app-project-card-v2',
  templateUrl: './project-card-v2.component.html',
  styleUrls: ['./project-card-v2.component.scss'],
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
export class ProjectCardV2Component
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('feedbackAreaRef') feedbackAreaRef: ElementRef;
  @ViewChild('carouselRef') carouselRef: ElementRef;
  @ViewChild('carouselNavRef') carouselNavRef: ElementRef;

  @Input() public currentUser: User;
  @Input() public raterID: number;
  @Input() public project: Project;
  @Input() public isConversationsProject: boolean;
  @Input() public isNewsfeedPresentation: boolean;
  @Input() public isPublicProfileProject: boolean;
  @Input()
  private selectFeedbackFromConversation$: BehaviorSubject<NewsfeedFeedback>;
  @Input() private activeInsightsChannel: InsightsChannelEnum;

  public rater: User;
  public isInUserMode: boolean;

  private mainSlider: Flickity;

  public selectedUserFeedbackType: string;
  public selectedDisplayType: string | number = 'grid';
  private selectedFeedback: NewsfeedFeedback;

  public allFeedbacksObject: AllFeedbacksObject;
  private allFeedbacksFromUser: NewsfeedFeedback[];

  public currentChatMessage: Message;
  public feedbackChatMessageSaving = false;
  public feedbackChatMessageSaved = false;

  public selectedFeedbackForImageView: NewsfeedFeedback;
  public selectedFeedbackId: number; // for when we click feedback

  public showScreenshot: boolean;
  public screenshotSrc: string;

  public showDrawing$ = new EventEmitter<boolean>();

  public showCurves: boolean;
  public isFileInfoOpen: boolean;
  public resortAvailable = false;

  public get isAuthor() {
    return (
      this.currentUser &&
      (this.project.user?.id === this.currentUser.id ||
        this.project.user_id === this.currentUser.id)
    );
  }

  constructor(
    private conversationsService: ConversationsService,
    private projectService: ProjectService,
    private newsfeedService: NewsfeedService,
    private messagesService: MessagesService,
    private authService: AuthService,
    private advisorsService: AdvisorsService,
    private insightsService: InsightsService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    if (this.isPublicProfileProject) {
      this.allFeedbacksObject = {};
    }
  }

  ngAfterViewInit(): void {
    if (this.isConversationsProject) {
      this.subscribeToSelectFeedbackFromConversation();
    }

    if (!this.isPublicProfileProject) {
      this.fetchProjectAndRater();
    } else {
      this.initSliders();
    }
  }

  subscribeToSelectFeedbackFromConversation() {
    this.selectFeedbackFromConversation$
      ?.pipe(
        takeUntil(this.destroyed),
        tap((res: NewsfeedFeedback) => {
          this.selectFeedbackByFeedback(res);
          this.selectTab(res.feedbacktype);
          setTimeout(() => {
            this.selectFeedbackForImageView(res);
            const el = document.getElementById('feedback-' + res.id);
            el.scrollIntoView({ behavior: 'smooth' });
          });
        }),
      )
      .subscribe();
  }

  isAnon(userId: number) {
    return this.authService.isAnon(userId);
  }

  switchToUserMode() {
    this.isInUserMode = true;
  }

  switchToProjectMode() {
    this.isInUserMode = false;
    this.cdRef.detectChanges();
    this.initSliders();
  }

  private fetchData() {
    return this.insightsService
      .fetchClosedRatebackSessionFeedbacksForProjectAndRater(
        this.project.id,
        this.rater.id,
      )
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => {
          if (
            this.activeInsightsChannel &&
            this.activeInsightsChannel !== InsightsChannelEnum.latest
          ) {
            this.allFeedbacksFromUser = res.filter((obj) => {
              if (
                this.activeInsightsChannel === InsightsChannelEnum.inspiring
              ) {
                return obj.rateback_score === 5;
              }

              if (this.activeInsightsChannel === InsightsChannelEnum.helpful) {
                return obj.rateback_score === 1;
              }

              if (
                this.activeInsightsChannel === InsightsChannelEnum.unhelpful
              ) {
                return obj.rateback_score === -1;
              }

              if (
                this.activeInsightsChannel === InsightsChannelEnum.discouraging
              ) {
                return obj.rateback_score === -5;
              }

              if (
                this.activeInsightsChannel === InsightsChannelEnum.strengths
              ) {
                return obj.feedbacktype === 'strengthsItems';
              }

              if (
                this.activeInsightsChannel === InsightsChannelEnum.weaknesses
              ) {
                return obj.feedbacktype === 'weaknessesItems';
              }

              if (
                this.activeInsightsChannel === InsightsChannelEnum.nextsteps
              ) {
                return obj.feedbacktype === 'nextstepsItems';
              }

              if (this.activeInsightsChannel === InsightsChannelEnum.links) {
                return obj.feedbacktype === 'linksItems';
              }
            });
          } else {
            this.allFeedbacksFromUser = res;
          }

          this.cdRef.detectChanges();
          this.parseFeedbacks();
          this.checkIfResortAvailable();
          this.initSliders();
        }),
      );
  }

  initSliders() {
    setTimeout(() => {
      const horizontalSlider = new Flickity(this.carouselNavRef.nativeElement, {
        setGallerySize: false,
        asNavFor: this.carouselRef.nativeElement,
        contain: true,
        pageDots: false,
        prevNextButtons: false,
      });

      this.mainSlider = new Flickity(this.carouselRef.nativeElement, {
        imagesLoaded: true,
        fullscreen: true,
        lazyLoad: true,
        setGallerySize: false,
        pageDots: false,
        wrapAround: true,
        draggable: false,
      });

      horizontalSlider.on('staticClick', () => {
        const prevFileId = this.selectedDisplayType;
        setTimeout(() => {
          if (this.selectedDisplayType === prevFileId) {
            this.toggleFileInfo(true);
          }
        });
      });

      this.mainSlider.on('change', (event) => {
        this.selectFeedbackByIndex(event);
      });

      if (!this.isPublicProfileProject) {
        this.selectFirstAvailableFeedback();
        this.cdRef.detectChanges();
      }
    });
  }

  private selectFeedbackByFeedback(feedback: NewsfeedFeedback) {
    let index = 0;
    const resortFactor = +this.resortAvailable;

    if (feedback.feedbacktype === 'resortItems') {
      this.selectedDisplayType = 'resort';
    } else if (feedback.display_type === 'project') {
      this.selectedDisplayType = 'grid';
      index = 0 + resortFactor;
    } else if (feedback.display_type === 'concept') {
      this.selectedDisplayType = 'concept';
      index = +!(this.project.projectfiles.length === 1) + resortFactor;
    } else if (feedback.display_type === 'file') {
      const fileId = feedback.projectfile_id;
      this.selectedDisplayType = fileId;

      const fileFactor =
        +!(this.project.projectfiles.length === 1) + 1 + resortFactor;
      index =
        this.project.projectfiles.findIndex((file) => +file.id === fileId) +
        fileFactor;
    }

    this.mainSlider.select(index);
  }

  private selectFeedbackByIndex(cellIndex: number) {
    const selectFeedback = (obj) => {
      if (this.isPublicProfileProject) {
        return;
      }
      this.selectedFeedback = Object.values(obj).flat()[0];
    };

    if (this.resortAvailable) {
      cellIndex -= 1;
    }

    if (this.project.projectfiles.length === 1) {
      if (cellIndex === 0) {
        this.selectedDisplayType = 'concept';
        selectFeedback(this.allFeedbacksObject.concept);
      } else {
        const fileId = this.project.projectfiles[0].id;
        this.selectedDisplayType = +fileId;
        selectFeedback(this.allFeedbacksObject[+fileId]);
      }
    } else {
      if (cellIndex === -1) {
        this.selectedDisplayType = 'resort';
        this.selectedFeedback = this.allFeedbacksObject.resort[0];
      } else if (cellIndex === 0) {
        this.selectedDisplayType = 'grid';
        selectFeedback(this.allFeedbacksObject.grid);
      } else if (cellIndex === 1) {
        this.selectedDisplayType = 'concept';
        selectFeedback(this.allFeedbacksObject.concept);
      } else {
        const fileId = this.project.projectfiles[cellIndex - 2].id;
        this.selectedDisplayType = +fileId;
        selectFeedback(this.allFeedbacksObject[+fileId]);
      }
    }

    this.selectFirstNonEmptyFeedbacktype();
  }

  async fetchProjectAndRater() {
    this.advisorsService
      .fetchAdvisorProfile(this.raterID)
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.rater = res)),
        mergeMap(() => this.fetchData()),
      )
      .subscribe();
  }

  private parseFeedbacks() {
    const feedbacks = {
      conceptFeedbacks: this.allFeedbacksFromUser.filter(
        (obj) => obj.display_type === 'concept',
      ),
      gridFeedbacks: this.allFeedbacksFromUser.filter(
        (obj) =>
          obj.display_type === 'project' && obj.feedbacktype !== 'resortItems',
      ),
    };

    const feedbackTypes = [
      'strengthsItems',
      'weaknessesItems',
      'nextstepsItems',
      'linksItems',
    ];
    const getAllFeedbackObjectItem = (arrayKey) => {
      const res = {};
      feedbackTypes.forEach(
        (type) =>
          (res[type] = feedbacks[arrayKey].filter(
            (feedback) => feedback.feedbacktype === type,
          )),
      );
      return res as FeedbacksForType;
    };

    this.allFeedbacksObject = {
      concept: getAllFeedbackObjectItem('conceptFeedbacks'),
      grid: getAllFeedbackObjectItem('gridFeedbacks'),
      resort: this.allFeedbacksFromUser.filter(
        (obj) => obj.feedbacktype === 'resortItems',
      ),
    };

    this.project.projectfiles.forEach((projectfile) => {
      const res = {};
      feedbackTypes.forEach(
        (type) =>
          (res[type] = this.allFeedbacksFromUser.filter((feedback) => {
            return (
              feedback.feedbacktype === type &&
              feedback.projectfile_id === +projectfile.id
            );
          })),
      );
      this.allFeedbacksObject[+projectfile.id] = res as FeedbacksForType;
    });

    this.cdRef.detectChanges();
  }

  feedbackCount(type: string | number) {
    if (!this.allFeedbacksObject) {
      return 0;
    }

    if (type === 'resort') {
      return this.allFeedbacksObject[type].length;
    } else if (this.allFeedbacksObject[type]) {
      return Object.values(this.allFeedbacksObject[type]).flat().length;
    }
  }

  selectTab(feedbackType: string) {
    if (
      !this.allFeedbacksObject[this.selectedDisplayType][feedbackType].length
    ) {
      return;
    }

    this.cdRef.detectChanges();

    this.selectedUserFeedbackType = feedbackType;
    this.feedbackAreaRef.nativeElement.scrollTop = 0;
  }

  selectFirstAvailableFeedback() {
    if (!this.allFeedbacksFromUser.length) {
      return;
    }

    let index = 0;
    this.selectedFeedback = this.allFeedbacksFromUser[0];
    const resortFactor = +this.resortAvailable;

    if (this.selectedFeedback.feedbacktype === 'resortItems') {
      this.selectedDisplayType = 'resort';
    } else if (this.selectedFeedback.display_type === 'project') {
      this.selectedDisplayType = 'grid';
      index = 0 + resortFactor;
    } else if (this.selectedFeedback.display_type === 'concept') {
      this.selectedDisplayType = 'concept';
      index = +!(this.project.projectfiles.length === 1) + resortFactor;
    } else if (this.selectedFeedback.display_type === 'file') {
      const fileId = this.selectedFeedback.projectfile_id;
      this.selectedDisplayType = fileId;

      const fileFactor =
        +!(this.project.projectfiles.length === 1) + 1 + resortFactor;
      index =
        this.project.projectfiles.findIndex((file) => +file.id === fileId) +
        fileFactor;
    }

    this.mainSlider.select(index);
    this.selectFirstNonEmptyFeedbacktype();
  }

  selectFirstNonEmptyFeedbacktype() {
    if (!this.selectedFeedback) {
      return;
    }

    this.selectedUserFeedbackType = this.selectedFeedback.feedbacktype;
    this.cdRef.detectChanges();
  }

  didSelectRerateRateback(feedback: NewsfeedFeedback, ratebackType: number) {
    feedback.rateback_score = ratebackType;
    this.newsfeedService
      .updateRatebackForFeedback(feedback.id, ratebackType)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  deselectFeedback() {
    if (!this.selectedFeedbackId) {
      return;
    }

    this.selectedFeedbackId = null;
    this.showScreenshot = false;
    this.showCurves = false;
    this.showDrawing$.emit(false);
    this.proceedSelectFeedback(null);
  }

  // wondering will it ever have errors when clickoutside fires earlier than click
  selectFeedbackForImageView(feedback: NewsfeedFeedback, event?: Event) {
    event?.stopPropagation();

    if (this.selectedFeedbackId === feedback.id) {
      if (
        (this.showScreenshot && !feedback.avratingparam_id) ||
        this.showCurves ||
        (!this.showScreenshot && !this.showCurves)
      ) {
        this.deselectFeedback();
        return;
      }
    } else {
      this.selectedFeedbackId = feedback.id;
    }

    if (feedback.screenshot) {
      if (!this.showScreenshot) {
        this.showCurves = false;
        this.showScreenshot = true;
        this.screenshotSrc = feedback.screenshot;
        return;
      }

      if (feedback.avratingparam_id) {
        this.showCurves = true;
      }

      this.showScreenshot = false;
    } else if (feedback.avratingparam_id) {
      this.showScreenshot = false;
      this.showCurves = true;
    }

    if (feedback.drawing) {
      this.proceedSelectFeedback(feedback);
      this.showDrawing$.emit(true);
      return;
    }

    this.proceedSelectFeedback(feedback);
  }

  proceedSelectFeedback(feedback: NewsfeedFeedback) {
    this.selectedFeedbackForImageView = feedback;
    this.cdRef.detectChanges();
  }

  onChatMessageSendClick(event: Partial<Message>) {
    this.feedbackChatMessageSaving = true;

    this.conversationsService
      .createConversation(
        this.project.user.id,
        this.raterID,
        this.project.id,
        this.rater.advisorrate,
        this.selectedFeedback.projectfile_id,
      )
      .pipe(
        takeUntil(this.destroyed),
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
        tap((res: Message) => {
          this.feedbackChatMessageSaved = true;
          this.currentChatMessage = res;
        }),
      )
      .subscribe();
  }

  checkIfResortAvailable() {
    this.resortAvailable = this.feedbackCount('resort') > 0;
  }

  public getRatebackName(rateback: number): string[] {
    if (rateback === 5) {
      return ['inspiring', 'Brilliant insight'];
    }
    if (rateback === 1) {
      return ['helpful', 'Helpful'];
    }
    if (rateback === -1) {
      return ['unhelpful', 'Not helpful'];
    }
    if (rateback === -5) {
      return ['discouraging', 'Disrespectful'];
    }
  }

  public toggleFileInfo(isToggle?: boolean) {
    if (!isToggle) {
      this.isFileInfoOpen = false;
      return;
    }

    this.isFileInfoOpen = !this.isFileInfoOpen;
  }

  public hideProject() {
    this.projectService
      .updateProject({
        ...this.project,
        private: !this.project.private,
        choosethebest: this.project.private,
      })
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.project.private = res.private)),
      )
      .subscribe();
  }
}
