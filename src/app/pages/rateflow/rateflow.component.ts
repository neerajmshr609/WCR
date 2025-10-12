import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, EMPTY, of, Subject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  catchError,
  filter,
  finalize,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DragSliderModalComponent } from './drag-slider-modal/drag-slider-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ProjectService } from 'src/app/services/project.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { SharedService } from 'src/app/services/shared.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { OnboardingModalComponent } from 'src/app/shared/components/onboarding-modal/onboarding-modal.component';
import { Category } from 'src/app/shared/models/category.model';
import { Feedback } from 'src/app/shared/models/feedback.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { PaymentRequestBySeconds } from 'src/app/shared/models/payment-request';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { Skipsetting } from 'src/app/shared/models/skipsetting.model';
import { User } from 'src/app/shared/models/user.model';
import { delayedRetry } from 'src/app/shared/retry.operator';
import { PleaseLoginModalComponent } from './please-login-modal/please-login-modal.component';

@Component({
  selector: 'app-rateflow',
  templateUrl: './rateflow.component.html',
  styleUrls: ['./rateflow.component.scss'],
})
export class RateflowComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('greytBtnRef') private greytBtnRef: ElementRef;

  private currentUser: User;

  public sharetoken: string;
  public project: Project;
  public isSingleFileProject: boolean;
  public noprojects: boolean;

  public dragDrop: boolean;
  public showResort = true;
  public droppedElements: Projectfile[] = [];
  public elementsToDrop: Projectfile[] = [];
  public sortOptions = {
    group: 'resort',
    onEnd: () => {
      this.rateflowService.newOrder.next(this.elementsToDrop);
    },
  };

  public drawingDesktop: boolean;
  public drawingMobile: boolean;
  public linesPoints: Array<string>;

  private paymentRequest: PaymentRequestBySeconds;

  public isSkipMode: boolean;
  public skipTime = 'day';
  public skipSetting: Skipsetting;

  public selectedFile: Projectfile;
  public activeFeedbackObject: Feedbackobject;
  public selectedFileDidChange$ = new BehaviorSubject<Projectfile>(null);
  public filesFeedback$ = new Subject<Feedbackobject>();
  public deleteFeedback = new EventEmitter<Feedback>();

  public sliderValue: number;
  public sliderDragged: boolean;

  public loaded: boolean;
  public isSaving: boolean;

  public iframeOpened: boolean;
  public showIframe = new EventEmitter();
  public showIframe2 = new EventEmitter();

  public iframeUrl: string;

  public submitConfirmedStorage: boolean;
  public submitConfirmed: boolean;
  public showSubmitConfirm: boolean;

  closeTimer$ = new Subject<boolean | null>();
  private draftInterval = {
    local: null,
    server: null,
  };

  constructor(
    private rateflowService: RateflowService,
    private projectService: ProjectService,
    private analyticsService: AnalyticsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    this.parseParams();
    this.getHelpVideoUrl();
    this.subscribeToUser();
    this.subscribeToDraft();
    this.subscribeToProject();
  }

  ngAfterViewInit() {
    //document.querySelector('body').classList.add('scroll-y');
  }

  private parseParams() {
    this.submitConfirmed =
      localStorage.getItem('submitReviewConfirmed') === 'true';
    const params = this.route.snapshot.params;
    this.sharetoken = params.id;
  }

  private subscribeToUser() {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        tap((res: User) => (this.currentUser = res)),
      )
      .subscribe();
  }

  private getHelpVideoUrl() {
    if (this.authService.userIsSignedIn()) {
      this.iframeUrl = 'NtPxDIEQnsY';
    } else {
      this.iframeUrl = 'esDpKKuYnA4';
    }
  }

  private subscribeToDraft() {
    this.rateflowService.draftParsed$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap(() => {
          const allFeedbacks = [
            this.rateflowService.state.currentProjectFeedbacks,
            this.rateflowService.state.currentInfoFeedbacks,
            ...this.rateflowService.state.currentFilesFeedbacks,
          ];
          if (allFeedbacks.some((feedback) => feedback.sliderdragged)) {
            this.sliderDragged = true;
          }

          const newOrder = this.rateflowService.newOrder.value;
          if (newOrder?.length) {
            this.showResort = false;
            setTimeout(() => {
              this.droppedElements = this.elementsToDrop.filter(
                (file) => !newOrder.includes(file),
              );
              this.elementsToDrop = this.elementsToDrop.filter((file) =>
                newOrder.includes(file),
              );
              this.showResort = true;
            });
          }

          this.isSingleFileProject
            ? this.onSelectedFileChange(this.project.projectfiles[0])
            : this.onSelectedGrid();
          this.cdr.detectChanges();
        }),
      )
      .subscribe();
  }

  private subscribeToProject() {
    this.getProject().pipe(takeUntil(this.destroyed)).subscribe();
  }

  public getProject() {
    this.loaded = false;
    this.project = null;
    this.dragDrop = false;
    this.sliderDragged = false;

    this.rateflowService.clearDrawingListEvt.emit(true);
    this.rateflowService.reinitState();

    const btn = this.greytBtnRef?.nativeElement as HTMLElement;
    btn?.classList.toggle('btn--disabled');

    const call = this.sharetoken
      ? this.getPublicProject()
      : this.getNextProject();

    return call.pipe(
      delayedRetry(2000, 3),
      tap((res) => this.loadProject(res)),
      filter(() => this.authService.userIsSignedIn()),
      mergeMap(() => {
        const drafts = JSON.parse(localStorage.getItem('feedbackDrafts'));
        const draft = drafts?.[this.project.id];
        return draft
          ? of(draft)
          : this.rateflowService.getDraftByProject(this.project.id);
      }),
      tap((res) => this.rateflowService.parseDraft(res, this.project)),
      catchError((err) => {
        this.noprojects = true;
        return throwError(err);
      }),
    );
  }

  private getNextProject() {
    return this.rateflowService.fetchNextProject();
  }

  private getPublicProject() {
    return this.projectService.fetchPublicProject(this.sharetoken);
  }

  private loadProject(project: Project) {
    this.selectedFile = null;

    if (!project) {
      this.noprojects = true;
      return;
    }

    this.isSingleFileProject = project.projectfiles.length === 1;
    this.project = project;
    this.project.projectfiles.forEach((file) =>
      file.avratingparams?.forEach((param) => (param.active = true)),
    );

    this.activeFeedbackObject =
      this.rateflowService.createProjectfeedbackForProject(project);
    this.elementsToDrop = [...this.project.projectfiles];
    this.rateflowService.initialOrder = [...this.elementsToDrop];

    if (this.isSingleFileProject) {
      this.onSelectedFileChange(this.project.projectfiles[0]);
    }

    setTimeout(() => (this.loaded = true));

    clearInterval(this.draftInterval.local);
    clearInterval(this.draftInterval.server);

    if (this.authService.userIsSignedIn()) {
      // this.draftInterval = {
      //   local: setInterval(() => this.saveDraft('local'), 20000),
      //   server: setInterval(() => this.saveDraft('server'), 500000)
      // };
    }

    this.cdr.detectChanges();
  }

  private saveDraft(type: 'local' | 'server') {
    const seconds =
      this.paymentRequest?.billable_seconds || this.paymentRequest?.due_seconds;
    if (type === 'local') {
      this.rateflowService.saveDraftLocal(this.project.id, seconds);
    }

    if (type === 'server') {
      this.rateflowService
        .saveDraftServer(this.project.id, seconds)
        .subscribe();
    }
  }

  closeResort() {
    this.toggleDragDrop(false);
    this.selectedFile = undefined;
    setTimeout(() => this.onSelectedGrid(), 0);
  }

  toggleDragDrop(toggle) {
    this.dragDrop = toggle;
  }

  toggleDraw(event) {
    if (event) {
      this.linesPoints = event.linesPoints;
      if (window.innerWidth < 769) {
        this.drawingMobile = event.active;
      } else {
        this.drawingDesktop = event.active;
      }
    }
  }

  onFeedbackObjectUpdate(update: Feedbackobject) {
    switch (update.ratingtype) {
      case 'project':
        this.rateflowService.updateProjectFeedback(update);
        break;
      case 'info':
        this.rateflowService.updateCurrentInfoFeedback(update);
        break;
      case 'files':
        this.rateflowService.updateFilesFeedbackForFile(
          this.selectedFile,
          update,
        );
        this.filesFeedback$.next(update);
        break;
      default:
        return;
    }
  }

  onFeedbackObjectDelete(feedback: Feedback): void {
    this.deleteFeedback.emit(feedback);
  }

  onSelectedGrid() {
    this.selectedFile = null;
    this.activeFeedbackObject = this.rateflowService.getProjectFeedback();
  }

  onSelectedProjectInfo() {
    this.selectedFile = null;
    this.activeFeedbackObject =
      this.rateflowService.updateCurrentInfoFeedback();
  }

  onSelectedFileChange(file: Projectfile) {
    this.selectedFile = file;
    this.activeFeedbackObject =
      this.rateflowService.updateFilesFeedbackForFile(file);
    this.selectedFileDidChange$.next(file);
  }

  onSkipModeToggled(isToggled: boolean) {
    this.isSkipMode = isToggled;
  }

  onSkipModeChanged(skipSetting: {
    mode: string;
    category: Category;
    parentCategory: Category;
  }) {
    this.skipSetting = skipSetting;
  }

  onFileDetailClose() {
    this.selectedFile = null;
    this.activeFeedbackObject = this.rateflowService.getProjectFeedback();
  }

  onPaymentCounterUpdate(paymentRequest: PaymentRequestBySeconds) {
    this.paymentRequest = paymentRequest;
  }

  onChangeBillableSeconds(value: number) {
    this.paymentRequest.billable_seconds = value;
  }

  untoggleSkipMode() {
    this.isSkipMode = false;
  }

  public confirmSubmit() {
    this.showSubmitConfirm = false;
    this.submitConfirmed = true;

    if (this.submitConfirmedStorage) {
      localStorage.setItem('submitReviewConfirmed', 'true');
    }

    this.onRate();
  }

  private openLoginModal(): void {
    const confirmDialog = this.dialog.open(PleaseLoginModalComponent, {
      autoFocus: false,
      width: '100%',
      maxWidth: '466px',
      maxHeight: '90vh',
      panelClass: 'please-login-modal',
    });

    confirmDialog.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.authService.openSignUpForm({ returnUrl: this.router.url });
      }
    });
  }

  onRate() {
    if (!this.authService.userIsSignedIn()) {
      this.openLoginModal();
      return;
    }

    if (this.isSkipMode) {
      this.skip();
      return;
    }

    if (!this.sliderDragged) {
      const dialog = this.dialog.open(DragSliderModalComponent, {
        maxWidth: '498px',
        autoFocus: false,
        panelClass: 'modal',
      });
      const subscription = dialog.componentInstance.showIframe.subscribe(() => {
        this.iframeOpened = true;
        this.showIframe.emit();
        subscription.unsubscribe();
      });
      return;
    }

    if (this.rateflowService.isEmpty()) {
      this.snackBar.open('Provide at least 1 comment', null, {
        duration: 3000,
      });
      return;
    }

    if (this.rateflowService.resortIsWithoutComment()) {
      this.snackBar.open(
        'Your resort suggestion requires at least 1 comment',
        null,
        {
          duration: 3000,
        },
      );
      return;
    }

    if (
      this.currentUser?.stripe_user_id &&
      this.project.paid_feedback_request
    ) {
      if (!this.paymentRequest) {
        this.snackBar.open('Make sure to start payment timer.', null, {
          duration: 3000,
        });
        return;
      }
    }

    if (!this.submitConfirmed && !this.submitConfirmedStorage) {
      this.showSubmitConfirm = true;
      return;
    }

    this.isSaving = true;

    if (this.authService.userIsSignedIn()) {
      this.rateflowService
        .saveAllData(
          this.project,
          this.currentUser.id,
          this.project.paid_feedback_request,
          this.paymentRequest?.due_seconds,
          this.paymentRequest?.billable_seconds,
        )
        .pipe(
          tap(() => {
            this.analyticsService.trackEvent('Rate', 'success');

            if (this.project.paid_feedback_request) {
              this.sharedService.feedbackRequestsCount--;
            }
          }),
          mergeMap(() => {
            this.submitConfirmed = false;
            if (this.sharetoken) {
              this.router.navigate(['rateflow']);
              return of(null);
            } else {
              return this.getProject();
            }
          }),
          finalize(() => (this.isSaving = false)),
          takeUntil(this.destroyed),
        )
        .subscribe();
    } else {
      this.rateflowService
        .saveAllDataForPublicReview(this.project)
        .pipe(
          takeUntil(this.destroyed),
          catchError((err) => {
            this.snackBar.open('Error on rating the project', null, {
              duration: 3000,
            });
            return throwError(err);
          }),
          finalize(() => (this.isSaving = false)),
          tap((res) => {
            this.analyticsService.trackEvent('Rate-Public', 'success');
            this.openOnboardingModal(res);
            this.router.navigateByUrl('/why');
          }),
        )
        .subscribe();
    }
  }

  private openOnboardingModal(feedbackSessionId) {
    const dialog = this.dialog.open(OnboardingModalComponent, {
      maxWidth: '92vw',
      width: '360px',
      maxHeight: '92vh',
      height: '750px',
      autoFocus: false,
      panelClass: 'modal',
      data: {
        step: 1,
        feedbackSessionId,
      },
    });
    dialog.componentInstance.showIframe.subscribe(() => {
      this.iframeOpened = true;
      this.showIframe.emit();
    });
  }

  skip() {
    this.isSaving = true;

    this.rateflowService
      .createSkipSetting(
        this.project.id,
        this.currentUser.id,
        this.skipTime,
        this.skipSetting.mode === 'project'
          ? null
          : this.skipSetting.categoryID,
        this.skipSetting.mode === 'project'
          ? null
          : this.skipSetting.parentCategoryID,
      )
      .pipe(
        finalize(() => (this.isSaving = false)),
        mergeMap(() => {
          if (this.sharetoken) {
            this.router.navigate([
              this.authService.userIsSignedIn() ? 'rateflow' : 'why',
            ]);
            return EMPTY;
          }
          return this.getProject();
        }),
        takeUntil(this.destroyed),
      )
      .subscribe(() => {
        (this.skipTime = 'day'), this.untoggleSkipMode();
      });
  }

  addDraw(e) {
    this.toggleDraw(false);
    this.rateflowService.drawing.next(e);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    // document.querySelector('body').classList.remove('scroll-y');
    clearInterval(this.draftInterval.local);
    clearInterval(this.draftInterval.server);
  }
}
