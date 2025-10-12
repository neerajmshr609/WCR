import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Avfeedbacklane } from 'src/app/shared/models/avfeedbacklane.model';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { User } from 'src/app/shared/models/user.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { ProjectService } from 'src/app/services/project.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { NewsfeedQuestionType } from 'src/app/shared/enums';
import { InsightsService } from 'src/app/services/insights.service';
import { RatebackEvt } from 'src/app/shared/models/rateback';
import { AudioMessage, Message } from 'src/app/shared/models/message.model';
import { PresenterQuestionAnswer } from 'src/app/shared/models/presenter-question-answer.model';
import { ANON_USER_ID } from 'src/config/config';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-newsfeed-item',
  templateUrl: './newsfeed-item.component.html',
  styleUrls: ['./newsfeed-item.component.scss'],
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
  ],
})
export class NewsfeedItemComponent extends BaseComponent implements OnInit {
  @Input() feedback: NewsfeedFeedback;
  @Input() currentUser: User;
  @Input() index: number;
  @Input() public rater: User;
  @Input() public project: Project;

  @Output() didGiveRatebackToItem = new EventEmitter<RatebackEvt>();

  @ViewChild('titleTextHighlight', { static: false })
  titleTextHighlight: ElementRef;

  public isGameCard: boolean;
  public isInsights: boolean;
  public isCTB: boolean;
  public isPresenterQuestion: boolean;
  public isDefaultFeedbackCard: boolean;

  ctbFiles: Projectfile[];

  titleText: string;
  titleTextHighlightString = '';

  addToAdvisorsDidChangeBehaviorSubject = new BehaviorSubject<number>(null);
  addToAdvisorsDidChangeBehaviorSubject$ =
    this.addToAdvisorsDidChangeBehaviorSubject
      .asObservable()
      .pipe(filter((val) => !!val));
  isInUserActionMode = false;

  currentPresenterQuestionAnswer: Message;
  presenterQuestionAnswerSaving = false;
  presenterQuestionAnswerSaved = false;

  isProjectInfoMode = false;

  currentChatMessage: string;

  directMessageParsed: boolean;
  feedbackChatMessageSaving = false;
  feedbackChatMessageSaved = false;

  selectedRateback: number;
  selectedUserFeedbackType: string;

  isSingleFileProject = false;
  feedbacksForSelectedCategory: Array<NewsfeedFeedback>;

  feedbackSelected: boolean;

  showScreenshot: boolean;
  screenshotLoading: boolean;
  showDrawing: boolean;
  showDrawingEvt = new EventEmitter<boolean>();

  public messageSentEvt = new EventEmitter<void>();
  public savedRatebackMessage: string;
  public savedRatebackAudio: AudioMessage;

  public projectFile: Projectfile;

  constructor(
    private rateflowService: RateflowService,
    private projectService: ProjectService,
    private newsfeedService: NewsfeedService,
    private authService: AuthService,
    private insightsService: InsightsService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {
    super();
  }

  public get isLogged(): boolean {
    return this.authService.userIsSignedIn();
  }

  public get isAuthor(): boolean {
    return this.project?.user.id === this.currentUser?.id;
  }

  public get isAnon(): boolean {
    return this.authService.isAnon(this.feedback.commenter_id);
  }

  ngOnInit() {
    this.fetchCommenter();
    this.selectUserFeedbackType();
    this.checkNewsfeedType();

    this.feedbacksForSelectedCategory =
      this.filterFeedbacksForSelectedCategory();
    const questionType = this.feedback.newsfeed_question_type;

    if (!this.isCTB && !this.isPresenterQuestion) {
      this.fetchProjectAndFiles();
    }

    if (questionType === NewsfeedQuestionType.guess_feedback_category) {
      this.titleText =
        'Guess in which feedback category the Connector put this comment:';
    }

    if (questionType === NewsfeedQuestionType.guess_rateback) {
      this.titleText =
        'Guess where the Creative put this comment after seeing it:';
    }

    if (questionType === NewsfeedQuestionType.guess_comment_lane) {
      this.titleText =
        'Which slider name below best matches the given comment:';
    }

    if (this.isInsights) {
      const rateback =
        this.insightsService.ratebacks?.[this.feedback.feedbacksession_id]?.[
          this.feedback.id
        ];
      if (rateback?.rateback) {
        this.didSelectRatebackForItem(rateback?.rateback);
      }
      if (rateback?.comment) {
        this.savedRatebackMessage = rateback.comment;
        this.savedRatebackAudio = rateback.audioMessage;
      }
      this.directMessageParsed = true;
    }

    if (this.isPresenterQuestion) {
      this.titleText = "Please answer \n the Creative's question";
      this.loadProject(this.feedback.presenter_project);
    }

    if (this.isCTB) {
      this.titleText = 'Choose which of the images \n you like the best';
      this.loadProject(this.feedback.choose_the_best_project);
      this.ctbFiles = this.feedback.choose_the_best_project.projectfiles;
    }
  }

  private fetchCommenter() {
    if (this.rater) {
      return;
    }

    if (this.feedback?.commenter_id) {
      this.authService
        .fetchUser(this.feedback.commenter_id)
        .pipe(
          takeUntil(this.destroyed),
          tap((res) => (this.rater = res)),
        )
        .subscribe();
    }
  }

  private selectUserFeedbackType() {
    if (this.feedback.userFeedbacksLinks?.length) {
      this.selectedUserFeedbackType = 'linksItems';
    }
    if (this.feedback.userFeedbacksNextsteps?.length) {
      this.selectedUserFeedbackType = 'nextstepsItems';
    }
    if (this.feedback.userFeedbacksWeaknesses?.length) {
      this.selectedUserFeedbackType = 'weaknessesItems';
    }
    if (this.feedback.userFeedbacksStrengths?.length) {
      this.selectedUserFeedbackType = 'strengthsItems';
    }
  }

  private checkNewsfeedType() {
    this.isGameCard = [
      'guess_comment_lane',
      'guess_feedback_category',
      'guess_rateback',
    ].includes(this.feedback.newsfeed_question_type);
    this.isCTB = this.feedback.newsfeed_question_type === 'choose_the_best';
    this.isPresenterQuestion =
      this.feedback.newsfeed_question_type === 'presenter_question';
    this.isInsights =
      this.feedback.newsfeed_question_type === 'feedback_rateback_stage';
    this.isDefaultFeedbackCard =
      this.feedback.newsfeed_question_type === 'feedback';
  }

  public didSelectRerateRateback(score: number) {
    this.feedback.rateback_score = score;
    this.newsfeedService
      .updateRatebackForFeedback(this.feedback.id, score)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  private filterFeedbacksForSelectedCategory() {
    if (!this.selectedUserFeedbackType && this.feedback.userFeedbacksResorts) {
      return this.feedback.userFeedbacksResorts.filter(
        (obj) => !obj.in_open_card_session,
      );
    }
    if (this.selectedUserFeedbackType === 'strengthsItems') {
      return this.feedback.userFeedbacksStrengths.filter(
        (obj) => !obj.in_open_card_session,
      );
    }
    if (this.selectedUserFeedbackType === 'weaknessesItems') {
      return this.feedback.userFeedbacksWeaknesses.filter(
        (obj) => !obj.in_open_card_session,
      );
    }
    if (this.selectedUserFeedbackType === 'nextstepsItems') {
      return this.feedback.userFeedbacksNextsteps.filter(
        (obj) => !obj.in_open_card_session,
      );
    }
    if (this.selectedUserFeedbackType === 'linksItems') {
      return this.feedback.userFeedbacksLinks.filter(
        (obj) => !obj.in_open_card_session,
      );
    }
    return [];
  }

  private handleEmptyRatebackObject() {
    if (!this.insightsService.ratebacks[this.feedback.feedbacksession_id]) {
      this.insightsService.ratebacks[this.feedback.feedbacksession_id] = {};
    }

    if (
      !this.insightsService.ratebacks[this.feedback.feedbacksession_id][
        this.feedback.id
      ]
    ) {
      this.insightsService.ratebacks[this.feedback.feedbacksession_id][
        this.feedback.id
      ] = {};
    }
  }

  public directMessageKeyUp(event: Partial<Message>) {
    this.savedRatebackMessage = event.body;
    this.savedRatebackAudio = event.audio_message;

    this.handleEmptyRatebackObject();
    const rateback =
      this.insightsService.ratebacks[this.feedback.feedbacksession_id][
        this.feedback.id
      ];
    rateback.comment = this.savedRatebackMessage;
    rateback.audioMessage = this.savedRatebackAudio;
    this.insightsService.storeRatebacks();
  }

  public onPresenterQuestionAnswerSendClick(event: Partial<Message>) {
    this.presenterQuestionAnswerSaving = true;

    const answer: PresenterQuestionAnswer = {
      answer: event.body,
      audio_message: event.audio_message,
      presenterquestion_id: this.feedback.presenter_question_id,
      user_id: this.currentUser?.id || ANON_USER_ID,
    };

    this.newsfeedService
      .addAnswerToQuestion(answer)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.presenterQuestionAnswerSaving = false)),
        tap((res: PresenterQuestionAnswer) => {
          this.currentPresenterQuestionAnswer = {
            body: res.answer,
            audio_message: res.audio_message,
            read: true,
            user_id: res.user_id,
          };
          this.presenterQuestionAnswerSaved = true;
        }),
      )
      .subscribe();
  }

  private loadProject(project: Project) {
    this.project = project;
    this.projectFile = this.project.projectfiles.find(
      (file) => +file.id === this.feedback.projectfile_id,
    );
    this.isSingleFileProject = this.project.projectfiles.length === 1;
    this.cdRef.detectChanges();
  }

  private fetchProjectAndFiles() {
    if (!this.project) {
      this.projectService
        .fetchProjectForFeedback(this.feedback.id)
        .pipe(
          takeUntil(this.destroyed),
          tap((res) => this.loadProject(res)),
        )
        .subscribe();
      return;
    }

    this.loadProject(this.project);
  }

  public onAddToReviewQueue(projectID: number) {
    this.projectService
      .addProjectToCurrentUserReviewQueue(projectID)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.currentUser.queuedprojects.push(res.project.id);
        this.cdRef.detectChanges();
      });
  }

  public onRemoveFromReviewQueue(projectID: number) {
    this.projectService
      .removeProjectFromCurrentUserReviewQueue(projectID)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.currentUser.queuedprojects = [
          ...this.currentUser.queuedprojects.filter((obj) => obj !== projectID),
        ];
        this.cdRef.detectChanges();
      });
  }

  public openProject() {
    if (!this.project) {
      this.projectService
        .fetchProjectForProjectfileID(this.feedback.projectfile_id)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res) => {
          this.loadProject(res[0]);
          this.cdRef.detectChanges();
        });
    }

    this.isProjectInfoMode = true;
    this.cdRef.detectChanges();
  }

  public closeProject() {
    this.isProjectInfoMode = false;
    this.cdRef.detectChanges();
  }

  public addToAdvisorsDidChange(userId: number) {
    this.addToAdvisorsDidChangeBehaviorSubject.next(userId);
  }

  public closeUserActionMode() {
    this.isInUserActionMode = false;
    this.cdRef.detectChanges();
  }

  onAddToMyAdvisers(feedback: NewsfeedFeedback, icon: HTMLImageElement) {
    this.rateflowService
      .addAdviserToFavorites(feedback.commenter_id, this.currentUser.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        icon.src = 'assets/newsfeed/heart-active.svg';
      });
  }

  didSelectRateback(rateback: number) {
    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'win');
    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'lose');

    this.titleText = 'You guessed';
    if (this.feedback.rateback_score === rateback) {
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'win');
      this.titleTextHighlightString = ' right';
    } else {
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'lose');
      this.titleTextHighlightString = ' wrong';
    }
  }

  didSelectRatebackForItem(rateback: number) {
    this.selectedRateback = rateback;
    this.handleEmptyRatebackObject();
    this.insightsService.ratebacks[this.feedback.feedbacksession_id][
      this.feedback.id
    ].rateback = rateback;
    this.insightsService.storeRatebacks();
    this.didGiveRatebackToItem.emit({ feedbackId: this.feedback.id, rateback });
  }

  newsfeedLaneDidSelect(lane: Avfeedbacklane, elem: EventTarget) {
    this.renderer.removeClass(elem, 'win');
    this.renderer.removeClass(elem, 'lose');

    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'win');
    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'lose');

    if (this.feedback.avratingparam_id === lane.id) {
      this.renderer.addClass(elem, 'win');
      this.titleText = 'You guessed';
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'win');
      this.titleTextHighlightString = ' right';
    } else {
      this.renderer.addClass(elem, 'lose');
      this.titleText = 'You guessed';
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'lose');
      this.titleTextHighlightString = ' wrong';
    }
  }

  newsfeedQuestionTypeDidSelect(type: string, elem: EventTarget) {
    this.renderer.removeClass(elem, 'win');
    this.renderer.removeClass(elem, 'lose');

    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'win');
    this.renderer.removeClass(this.titleTextHighlight.nativeElement, 'lose');

    if (this.feedback.feedbacktype === type) {
      this.renderer.addClass(elem, 'win');
      this.titleText = 'You guessed';
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'win');
      this.titleTextHighlightString = ' right';
    } else {
      this.renderer.addClass(elem, 'lose');
      this.titleText = 'You guessed';
      this.renderer.addClass(this.titleTextHighlight.nativeElement, 'lose');
      this.titleTextHighlightString = ' wrong';
    }
  }

  ctbDidSelectFile() {
    this.titleText = 'This is what other creatives think';
    this.cdRef.detectChanges();
  }

  selectFeedback() {
    this.feedbackSelected = !this.feedbackSelected;

    if (this.feedback.screenshot) {
      this.showItemScreenshot(this.feedbackSelected);
    }

    if (this.feedback.drawing) {
      this.showItemDrawing(this.feedbackSelected);
    }
  }

  showItemScreenshot(value: boolean) {
    if (this.showScreenshot || value) {
      this.showScreenshot = value;

      if (value) {
        this.screenshotLoading = true;
        const img = new Image();
        img.src = this.feedback.screenshot;
        img.onload = () => (this.screenshotLoading = false);
      }
    }
  }

  showItemDrawing(value: boolean) {
    if (this.showDrawing || value) {
      this.showDrawing = value;
      this.showDrawingEvt.emit(this.showDrawing);
    }
  }
}
