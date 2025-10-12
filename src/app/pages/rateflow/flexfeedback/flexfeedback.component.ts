import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Feedback } from 'src/app/shared/models/feedback.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { Project } from 'src/app/shared/models/project.model';
import { Skipsetting } from 'src/app/shared/models/skipsetting.model';
import { ProjectService } from 'src/app/services/project.service';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { InspiringrateModalComponent } from './inspiringrate-modal/inspiringrate-modal.component';
import { User } from 'src/app/shared/models/user.model';
import { SkipTimes } from 'src/app/shared/models/skip-times';
import { ScreenshotModalComponent } from './screenshot-modal/screenshot-modal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CropImageComponent } from 'src/app/shared/components/crop-image/crop-image.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { Uppy } from '@uppy/core';
import { AwsS3 } from 'uppy';
import { ANON_USER_ID, COMPANION_URL } from 'src/config/config';
import { PaymentRequestBySeconds } from 'src/app/shared/models/payment-request';
import { PaymentSession } from 'src/app/shared/models/payment-session';
import { AuthService } from 'src/app/auth/auth.service';
import {
  FlexfeedbackFirstTabFunctionality,
  ProjectRatingType,
  ProjectfileKind,
} from 'src/app/shared/enums';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

const SIMPLE_TABS = [
  {
    name: 'strengths',
    displayName: 'Strengths',
    formControlName: 'strengthsItems',
    inputText: 'Write what you do like',
  },
  {
    name: 'weaknesses',
    displayName: 'Weaknesses',
    formControlName: 'weaknessesItems',
    inputText: 'Write what you do not like',
  },
  {
    name: 'nextsteps',
    displayName: 'Next steps',
    formControlName: 'nextstepsItems',
    inputText: 'How would you improve it',
  },
  {
    name: 'links',
    displayName: 'Links',
    formControlName: 'linksItems',
    inputText: 'Add comment here',
  },
];
@Component({
  selector: 'app-flexfeedback',
  templateUrl: './flexfeedback.component.html',
  styleUrls: ['./flexfeedback.component.scss'],
  animations: [
    trigger('growWidth', [
      transition(':enter', [
        style({ width: 0, minWidth: 0 }),
        animate(150, style({ width: '4.6rem', minWidth: '4.6rem' })),
      ]),
      transition(':leave', [animate(150, style({ width: 0, minWidth: 0 }))]),
    ]),
  ],
})
export class FlexfeedbackComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  showSlider = true;
  sliderValue: number;

  @ViewChild('skipOptionsGroup') skipOptionsGroup: MatRadioGroup;
  @ViewChild('firstSkipChoice') firstSkipChoice: MatRadioButton;
  @ViewChild('messageInput') messageInput: ElementRef;
  @ViewChild('scroll') scroll: ElementRef;
  @ViewChild('screenshotInput') screenshotInput: ElementRef;
  @ViewChild('cardsFrontRef') private cardsFrontRef: ElementRef;
  @ViewChild('cardsBackRef') private cardsBackRef: ElementRef;

  @Input() backsideEnabled = true;
  @Input() closeTimer$: Observable<boolean>;
  @Input() feedbackObject: Feedbackobject;
  @Input() project: Project;
  @Input() files: Projectfile[];
  @Input() selectedFile: Projectfile;
  @Input() sortablejsOptions: {};
  @Input() isPublicFeedbackRequest = false;
  @Input() singleFileProject: boolean;
  @Input() selectedFileDidChange$: BehaviorSubject<Projectfile>;

  @Output() paymentCounterReset = new EventEmitter<boolean>();
  @Output() paymentCounterUpdate = new EventEmitter<PaymentRequestBySeconds>();
  @Output() feedbackObjectUpdate = new EventEmitter<Feedbackobject>();
  @Output() skipModeToggledUpdate = new EventEmitter<boolean>();
  @Output() skipModeChangedUpdate = new EventEmitter<Skipsetting>();
  @Output() messageSendUpdate = new EventEmitter<string>();
  @Output() skipRateUpdate = new EventEmitter<void>();
  @Output() resortOpen = new EventEmitter<boolean>();
  @Output() drawOpen = new EventEmitter<any>();
  @Output() sliderDragged = new EventEmitter<void>();
  @Output() skipTimeChange = new EventEmitter<string>();
  @Output() changeBillableSeconds = new EventEmitter<number>();

  public author: User;
  public currentUser: User;

  skipTime = 'day';
  skipTimes = SkipTimes;

  scrollElement: HTMLElement;

  private projectHasResortedFiles = false;
  private formUpdated = false;

  skipCategory: Artcategory;
  skipParentCategory: Artcategory;
  skipGrandCategory: Artcategory;
  skipCategories: Artcategory[] = [];

  currentFirstTabFunctionality: FlexfeedbackFirstTabFunctionality =
    FlexfeedbackFirstTabFunctionality.info;

  simpleTabs = SIMPLE_TABS;
  selectedTab: string;

  feedbackForm: UntypedFormGroup;
  urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  drawingList: Array<any> = [];

  draw = {
    active: false,
    tab: null,
    order: null,
    projectfileID: null,
  };

  screenshot = null;
  screenshotDialog: MatDialogRef<ScreenshotModalComponent>;
  screenshotDialogSubscription: Subscription;
  fileInput = new UntypedFormControl();
  uploader = new Uppy({ id: 'flexfeedback-uploader' }).use(AwsS3, {
    companionUrl: COMPANION_URL,
    metaFields: ['folder'],
  });

  audioMessageRecording = null;

  currentPaymentSession: PaymentSession;

  public get allParamsIsInactive(): boolean {
    return this.selectedFile?.avratingparams?.some((p) => p.active);
  }

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public rateflowService: RateflowService,
  ) {
    super();
  }

  public keepOriginalOrder = (a, b) => a.key;

  avControlDidClick() {
    this.rateflowService.avFilePlaybackClickChange$.next({
      state: this.selectedFile.loadState,
      fileIDString: this.selectedFile.id,
    });
  }

  counterDidReset() {
    this.paymentCounterReset.emit(true);
  }

  counterDidUpdate(paymentRequest: PaymentRequestBySeconds) {
    this.paymentCounterUpdate.emit(paymentRequest);
  }

  public onChangeBillableSeconds(value: number): void {
    this.changeBillableSeconds.emit(value);
  }

  userDidSetupPayouts(): boolean {
    if (!this.authService.userIsSignedIn()) {
      return false;
    }

    return this.currentUser.stripe_user_id != null;
  }

  ngOnInit() {
    this.initForm();
    this.selectInitialTab();
    this.subscribeToDrawing();

    this.getAuthor();

    this.subscribeToUser();
    this.subscribeToNewOrder();
    this.subscribeToClearDrawingList();

    this.resetScreenshotObject();
    this.resetAudioMessageObject();
  }

  private getAuthor() {
    this.authService
      .fetchUser(this.project.user_id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => (this.author = res));
  }

  private subscribeToUser() {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        tap((user) => (this.currentUser = user)),
      )
      .subscribe();
  }

  subscribeToNewOrder() {
    this.rateflowService.newOrder
      .pipe(takeUntil(this.destroyed))
      .subscribe((resortedFiles) => {
        if (resortedFiles?.length && !this.rateflowService.resortIsTheSame()) {
          this.projectHasResortedFiles = true;
        } else {
          this.projectHasResortedFiles = false;
        }

        setTimeout(() => {
          this.updateIconHighlight('resort', this.projectHasResortedFiles);
        });
      });
  }

  subscribeToClearDrawingList() {
    this.rateflowService.clearDrawingListEvt
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
        tap(() => (this.drawingList = [])),
      )
      .subscribe();
  }

  subscribeToDrawing() {
    this.rateflowService.drawing
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => res),
      )
      .subscribe((res: Array<string>) => {
        this.collectLines(
          this.draw.tab,
          this.draw.order,
          this.draw.projectfileID,
          res,
        );

        const feedback = this.feedbackObject.feedbacks.find((f) => {
          return (
            f.feedbacktype === this.draw.tab + 'Items' &&
            f.order === this.draw.order
          );
        });

        feedback.drawing = this.findFeedbackDrawing(
          this.draw.order,
          this.draw.tab,
        );
        this.closeDrawer();
      });
  }

  ngAfterViewInit() {
    if (this.scroll) {
      this.scrollElement = this.scroll.nativeElement;
    }
  }

  fetchArtcategories(categoryId: number) {
    return this.projectService.fetchArtcategory(categoryId).pipe(
      map((category) => {
        this.skipCategories.push(category);
        return category.parent_id;
      }),
      switchMap((parentId) =>
        parentId ? this.fetchArtcategories(parentId) : of(null),
      ),
    );
  }

  fetchCategoriesForCurrentProject() {
    this.skipModeChangedUpdate.emit(new Skipsetting('project'));

    const projectCategoryID = this.project.artcategory_id;
    if (projectCategoryID) {
      this.fetchArtcategories(projectCategoryID)
        .pipe(takeUntil(this.destroyed))
        .subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      const currentProject: Feedbackobject = changes.project.currentValue;
      if (currentProject) {
        this.fetchCategoriesForCurrentProject();
      }
    }

    if (changes.feedbackObject) {
      const currentItem: Feedbackobject = changes.feedbackObject.currentValue;
      const previousItem: Feedbackobject = changes.feedbackObject.previousValue;
      if (previousItem || currentItem.feedbacks?.length) {
        this.showSlider = false;
        setTimeout(() => {
          this.showSlider = true;
          this.cdr.detectChanges();
        });

        if (currentItem.ratingtype !== previousItem?.ratingtype) {
          this.feedbackObject = currentItem;
          if (!this.feedbackObject.feedbacks) {
            this.feedbackObject.feedbacks = [];
          }
        }

        if (currentItem.feedbacks) {
          this.resetComponent();
          this.updateForm();
        } else {
          this.initForm();
        }
      }
    }

    if (
      this.feedbackObject.ratingtype === ProjectRatingType.project &&
      this.project.projectfiles.length >= 2
    ) {
      this.currentFirstTabFunctionality =
        FlexfeedbackFirstTabFunctionality.resort;
    } else if (
      this.feedbackObject.ratingtype === ProjectRatingType.files &&
      this.selectedFile.kind in ProjectfileKind &&
      this.selectedFile.kind !== ProjectfileKind.image
    ) {
      this.currentFirstTabFunctionality = FlexfeedbackFirstTabFunctionality.av;
    } else {
      this.currentFirstTabFunctionality =
        FlexfeedbackFirstTabFunctionality.info;
    }

    setTimeout(() => this.selectInitialTab());
  }

  selectInitialTab() {
    if (
      this.selectedFile &&
      ['audio', 'video', 'hostedvideo'].includes(this.selectedFile.kind)
    ) {
      this.selectedTab = 'extra_functionality-tab';
    } else {
      this.selectedTab = 'strengths-tab';
    }
    setTimeout(() => {
      const elem: HTMLElement = document.getElementById(
        this.selectedTab,
      ) as HTMLElement;
      if (elem) {
        elem.click();
      }
    });
  }

  resetComponent() {
    this.updateTabHighlights();
    this.selectInitialTab();
  }

  collectLines(
    tab: string,
    order: number,
    projectfileID: number,
    linesPoints: string | Array<string>,
  ) {
    const list = this.drawingList.find(
      (l) =>
        l.order === order && l.tab === tab && l.projectfileID === projectfileID,
    );
    if (typeof linesPoints === 'string') {
      linesPoints = JSON.parse(linesPoints);
    }
    if (list) {
      list.linesPoints = linesPoints?.length ? linesPoints : [];
      return;
    }
    this.drawingList.push({ tab, order, projectfileID, linesPoints });
  }

  sliderValueDidChange(value) {
    this.feedbackObject.slidervalue = value;
  }

  updateForm() {
    const loadedResortItemsControls = this.getFormControls('resort', false);
    const loadedStrengthsItemsControls = this.getFormControls('strengths');
    const loadedWeaknessesItemsControls = this.getFormControls('weaknesses');
    const loadedNextstepsItemsControls = this.getFormControls('nextsteps');
    const loadedLinksItemsControls = this.getFormControls('links');

    loadedResortItemsControls.push(this.getFormControl());
    loadedStrengthsItemsControls.push(this.getFormControl());
    loadedWeaknessesItemsControls.push(this.getFormControl());
    loadedNextstepsItemsControls.push(this.getFormControl());
    loadedLinksItemsControls.push(this.getFormControl(null, 'links'));

    const resortItems = new UntypedFormArray(loadedResortItemsControls);
    const strengthsItems = new UntypedFormArray(loadedStrengthsItemsControls);
    const weaknessesItems = new UntypedFormArray(loadedWeaknessesItemsControls);
    const nextstepsItems = new UntypedFormArray(loadedNextstepsItemsControls);
    const linksItems = new UntypedFormArray(loadedLinksItemsControls);

    this.feedbackForm = new UntypedFormGroup({
      resortItems,
      strengthsItems,
      weaknessesItems,
      nextstepsItems,
      linksItems,
    });
    this.updateTabHighlights();
    this.formUpdated = true;
  }

  private getFormControls(
    type: string,
    collectLines = true,
  ): UntypedFormGroup[] {
    return this.feedbackObject.feedbacks
      .filter((feedback) => {
        return (
          feedback.feedbacktype === type + 'Items' &&
          (feedback.text || feedback.screenshot || feedback.drawing)
        );
      })
      .map((feedback) => {
        const fGroup = this.getFormControl(feedback, type);
        if (collectLines && this.selectedFile) {
          this.collectLines(
            type,
            feedback.order,
            +this.selectedFile.id,
            feedback.drawing,
          );
        }
        return fGroup;
      });
  }

  private getFormControl(object?: Feedback, type?: string): UntypedFormGroup {
    const fGroup = new UntypedFormGroup({
      text: new UntypedFormControl(object?.text || ''),
      screenshotLoading: new UntypedFormControl(
        object?.screenshotLoading || false,
      ),
      screenshot: new UntypedFormControl(object?.screenshot || ''),
      file: new UntypedFormControl(object?.file || ''),
      audio_message: new UntypedFormControl(object?.audio_message || {}),
      avratingparam_id: new UntypedFormControl(object?.avratingparam_id),
      avtracktimeposition: new UntypedFormControl(object?.avtracktimeposition),
      color: new UntypedFormControl(object?.local_avratingparam?.color),
      name: new UntypedFormControl(object?.local_avratingparam?.name),
    });
    if (type === 'links') {
      fGroup.addControl(
        'link',
        new UntypedFormControl(object?.link || '', [
          Validators.pattern(this.urlReg),
        ]),
      );
    }
    return fGroup;
  }

  initForm() {
    if (this.formUpdated) {
      return;
    }

    if (!this.feedbackObject.feedbacks) {
      this.feedbackObject.feedbacks = [];
    }

    this.files = [];

    const resortItems = new UntypedFormArray([]);
    const strengthsItems = new UntypedFormArray([]);
    const weaknessesItems = new UntypedFormArray([]);
    const nextstepsItems = new UntypedFormArray([]);
    const linksItems = new UntypedFormArray([]);

    resortItems.push(this.getFormControl());
    strengthsItems.push(this.getFormControl());
    weaknessesItems.push(this.getFormControl());
    nextstepsItems.push(this.getFormControl());
    linksItems.push(this.getFormControl(null, 'links'));

    this.feedbackForm = new UntypedFormGroup({
      resortItems,
      strengthsItems,
      weaknessesItems,
      nextstepsItems,
      linksItems,
    });

    this.updateTabHighlights();
  }

  onChangeTab(tabID: string) {
    this.drawOpen.emit({ active: false });
    this.initDraw();
    this.selectedTab = tabID;

    if (
      tabID === 'extra_functionality-tab' &&
      this.currentFirstTabFunctionality === 'resort'
    ) {
      this.resortOpen.emit(true);
    } else {
      this.resortOpen.emit(false);
    }

    this.rateflowService.didAddNewAVFeedback$.next(true);
  }

  onDeleteItem(tab: string, index: number) {
    const feedbackType = tab + 'Items';
    this.getFeedbackTypeFormArray(feedbackType).removeAt(index);

    const drawListIndex = this.drawingList.findIndex(
      (l) =>
        l.order === index &&
        l.tab === tab &&
        l.projectfileID === this.selectedFile?.id,
    );
    this.drawingList.splice(drawListIndex, 1);

    this.removeItemFromStore(index, feedbackType);
    this.cdr.detectChanges();
  }

  onProjectSkipCancel() {
    this.skipModeToggledUpdate.emit(false);
    this.cardsFrontRef.nativeElement.classList.remove(
      'flexfeedback__cards--front--rotate',
    );
    this.cardsBackRef.nativeElement.classList.remove(
      'flexfeedback__cards--back--rotate',
    );
  }

  onProjectSkip() {
    this.skipOptionsGroup.value = -1;
    this.firstSkipChoice.checked = true;
    this.cdr.detectChanges();

    this.skipModeToggledUpdate.emit(true);
    this.cardsFrontRef.nativeElement.classList.add(
      'flexfeedback__cards--front--rotate',
    );
    this.cardsBackRef.nativeElement.classList.add(
      'flexfeedback__cards--back--rotate',
    );
  }

  onSkipChange(change: MatRadioChange) {
    const setting = new Skipsetting();
    if (change.value === -1) {
      setting.mode = 'project';
    } else {
      const category = change.value as Artcategory;

      if (category.parent_id) {
        setting.categoryID = change.value.id;
      } else {
        setting.parentCategoryID = change.value.id;
      }
    }
    this.skipModeChangedUpdate.emit(setting);
  }

  updateIconHighlight(type: string, force = false) {
    const itemcount = this.feedbackObject.feedbacks?.filter(
      (obj) => obj.feedbacktype === type + 'Items',
    ).length;
    const container = document.getElementById(type + '-img');
    if (!container) {
      return;
    }

    if (itemcount || force) {
      container.style.opacity = '1';
    } else {
      container.style.opacity = '0.3';
    }
  }

  onKeydownEnter(event: Event, tab: string, currentInputText: string) {
    event.preventDefault();

    if (!currentInputText) {
      return;
    }

    const currentItem = document.querySelector(':focus');
    const items = Array.from(document.querySelectorAll(`#${tab} textarea`));
    const index = items.findIndex((el) => el === currentItem);
    const item = items[index + 1] as HTMLElement;
    item.focus();
  }

  onKeyupUpdate(index: number, tab: string, event?: KeyboardEvent) {
    if (event?.key === 'Enter' || this.draw.active) {
      return;
    }

    const input = document.getElementById(
      'input-' + tab + '-' + index,
    ) as HTMLTextAreaElement;
    this.updateItemInStore(index, tab, input?.value);
  }

  onKeyupUpdateLinkURL(index: number, tab: string, text: string) {
    if (this.draw.active) {
      return;
    }

    const feedbackType = tab + 'Items';
    this.updateLinkURLInStore(index, text, feedbackType);
  }

  didAddAVFeedback(feedback: Feedback) {
    if (!this.feedbackObject.feedbacks) {
      this.feedbackObject.feedbacks = [];
    }

    const feedbackType = feedback.feedbacktype.split('Items')[0];
    const formArray = this.feedbackForm.get(
      feedback.feedbacktype,
    ) as UntypedFormArray;

    if (formArray.controls.length === 1 && !formArray.controls[0].value.text) {
      formArray.insert(0, this.getFormControl(feedback, feedbackType));
      feedback.order = 0;
    } else {
      formArray.removeAt(formArray.length - 1);
      formArray.push(this.getFormControl(feedback, feedbackType));

      const count = this.feedbackObject.feedbacks.filter(
        (obj) => obj.feedbacktype === feedback.feedbacktype,
      ).length;
      feedback.order = count;
      formArray.push(this.getFormControl(null, feedbackType));
    }

    this.feedbackObject.feedbacks.push(feedback);
    this.feedbackObjectUpdate.emit(this.feedbackObject);
    this.updateTabHighlights();
  }

  onSkipRate() {
    this.skipRateUpdate.emit();
    this.drawingList = [];
  }

  updateTabHighlights() {
    this.updateIconHighlight('resort', this.projectHasResortedFiles);
    this.simpleTabs.forEach((tab) => this.updateIconHighlight(tab.name));
    this.cdr.detectChanges();
  }

  removeItemFromStore(index: number, feedbackType: string) {
    const toRemove = this.getFeedbackObject(feedbackType, index);

    this.feedbackObject.feedbacks = this.feedbackObject.feedbacks.filter(
      (obj) => obj !== toRemove,
    );
    this.feedbackObject.feedbacks.forEach((feedback) => {
      if (feedback.feedbacktype === feedbackType && feedback.order > index) {
        feedback.order -= 1;
      }
    });

    this.rateflowService.feedbackObjectDelete.emit(toRemove);

    this.updateTabHighlights();
  }

  updateLinkURLInStore(itemIndex: number, text: string, feedbackType: string) {
    const feedbackIndex = this.getFeedbackIndex(feedbackType, itemIndex);
    const feedback = this.feedbackObject.feedbacks[feedbackIndex];

    if (!feedback) {
      return;
    }

    feedback.link = text;
    this.feedbackObject.feedbacks[feedbackIndex] = feedback;
    this.feedbackObjectUpdate.emit(this.feedbackObject);
    this.updateTabHighlights();
  }

  updateItemInStore(itemIndex: number, tab: string, text?: string) {
    if (!this.feedbackObject.feedbacks) {
      this.feedbackObject.feedbacks = [];
    }

    const feedbackType = tab + 'Items';
    let feedbackIndex = this.getFeedbackIndex(feedbackType, itemIndex);
    let feedback = this.feedbackObject.feedbacks[feedbackIndex];

    if (!feedback) {
      feedback = this.createFeedback(text, tab);
      this.feedbackObject.feedbacks.push(feedback);
      feedbackIndex = this.getFeedbackIndex(feedbackType, itemIndex);
    }

    const audio = this.audioMessageRecording;
    if (
      this.screenshot.base64 &&
      this.screenshot.index === itemIndex &&
      this.screenshot.tab === tab
    ) {
      this.addScreenshotToFeedback(feedback, feedbackType, itemIndex);
    } else if (
      audio.audio_message.recording ||
      (audio.order === itemIndex && audio.tab === tab)
    ) {
      this.addAudioToFeedback(feedback, tab, itemIndex);
    } else {
      feedback.text = text;
    }

    this.feedbackObject.feedbacks[feedbackIndex] = feedback;
    this.feedbackObjectUpdate.emit(this.feedbackObject);
    this.updateTabHighlights();
  }

  createFeedback(text: string, tab: string) {
    const feedbackType = tab + 'Items';
    const count = this.feedbackObject.feedbacks.filter(
      (obj) => obj.feedbacktype === feedbackType,
    ).length;
    const feedback = new Feedback(text, count, feedbackType);
    feedback.drawing = this.findFeedbackDrawing(count, tab);

    return feedback;
  }

  public handleControlValueChanges(empty: boolean, index: number, tab: string) {
    const feedbackType = tab + 'Items';

    const items = this.feedbackForm.value[feedbackType];
    const formArray = this.getFeedbackTypeFormArray(feedbackType);
    const controls = this.getControls(feedbackType);

    if (empty && controls.length > 1) {
      formArray.removeAt(index);
      this.removeItemFromStore(index, feedbackType);
    }

    const lastControl = controls[controls.length - 1].value;
    if (
      items.length + 1 !== controls.length &&
      (lastControl.text ||
        lastControl.screenshot ||
        lastControl.audio_message.recording)
    ) {
      formArray.push(this.getFormControl(null, tab));
    }
  }

  hasAVInfoForFormControl(index: number, feedbackType: string) {
    if (!this.feedbackObject || !this.feedbackObject.feedbacks) {
      return false;
    }

    const feedback = this.getFeedbackObject(feedbackType, index);
    return feedback && feedback.local_avratingparam;
  }

  avParamColorForFormControl(index: number, feedbackType: string) {
    const feedback = this.getFeedbackObject(feedbackType, index);
    return feedback.local_avratingparam.color;
  }

  avParamNameForFormControl(index: number, feedbackType: string) {
    const feedback = this.getFeedbackObject(feedbackType, index);
    return feedback.local_avratingparam.name;
  }

  trackPositionStringForFormControl(index: number, feedbackType: string) {
    const feedback = this.getFeedbackObject(feedbackType, index);
    return (feedback.avtracktimeposition / 100).toFixed(2);
  }

  trackPositionStringForPosition(position: number) {
    return (position / 100).toFixed(2);
  }

  findFeedbackDrawing(index: number, tab: string) {
    const res = this.drawingList.find(
      (l) =>
        l.tab === tab &&
        l.order === index &&
        l.projectfileID === +this.selectedFile?.id,
    );
    if (res) {
      const linePoints = res.linesPoints;
      return JSON.stringify(linePoints);
    }

    return null;
  }

  public feedbackHasDraw(order: number, tab: string): boolean {
    const draw = this.drawingList.find(
      (l) =>
        l.order === order &&
        l.tab === tab &&
        l.projectfileID === +this.selectedFile?.id,
    );
    return draw?.linesPoints?.length;
  }

  sideScroll(direction: string, speed: number, distance: number, step: number) {
    let scrollAmount = 0;
    const slideTimer = window.setInterval(() => {
      if (direction === 'left') {
        this.scrollElement.scrollLeft -= step;
      } else {
        this.scrollElement.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  }

  back() {
    this.sideScroll('left', 25, 100, 10);
  }

  forward() {
    this.sideScroll('right', 25, 100, 10);
  }

  openDrawer(index: number, tab: string) {
    document.querySelector('.content').classList.add('draw-opened');
    const feedBackDraw = this.drawingList.find(
      (l) =>
        l.order === index &&
        tab === l.tab &&
        +this.selectedFile.id === l.projectfileID,
    );

    if (
      this.draw.tab === tab &&
      this.draw.order === index &&
      this.draw.projectfileID === +this.selectedFile.id
    ) {
      this.closeDrawer();
      return;
    }

    this.drawOpen.emit({
      active: true,
      ...(feedBackDraw && { linesPoints: feedBackDraw.linesPoints }),
    });

    this.initDraw(true, tab, index, +this.selectedFile.id);
  }

  closeDrawer() {
    document.querySelector('.content').classList.remove('draw-opened');
    this.drawOpen.emit({ active: false });
    this.initDraw();
  }

  initDraw(
    state = false,
    tab: string = null,
    order: number = null,
    projectfileID: number = null,
  ) {
    this.draw.active = state;
    this.draw.tab = tab;
    this.draw.order = order;
    this.draw.projectfileID = projectfileID;
    this.toggleInputsDisabled();
  }

  toggleInputsDisabled() {
    const controls = Object.values(
      this.feedbackForm.controls,
    ) as UntypedFormArray[];
    controls.forEach((array: UntypedFormArray) => {
      array.controls.forEach((control: UntypedFormGroup) => {
        control.get('text').enable();
        control.get('link')?.enable();
      });
    });

    if (!this.draw.tab) {
      return;
    }

    const currentDrawTab = this.feedbackForm.get(
      this.draw.tab + 'Items',
    ) as UntypedFormArray;
    currentDrawTab.controls[this.draw.order].get('text').disable();
    currentDrawTab.controls[this.draw.order].get('link')?.disable();
  }

  onSliderDragged() {
    this.sliderDragged.emit();
    this.feedbackObject.sliderdragged = true;
  }

  openInspiringrateModal() {
    this.dialog.open(InspiringrateModalComponent, {
      maxWidth: '92vw',
      width: '360px',
      maxHeight: '92vh',
      height: '620px',
      autoFocus: false,
      panelClass: 'modal',
      data: {
        rate: this.project.paid_feedback_request
          ? this.currentUser.advisorrate
          : this.project.inspiringrate,
        projectId: this.project.id,
      },
    });
  }

  toggleMode(value: boolean): void {
    this.rateflowService.playingModeChange.emit(value);
  }

  selectSkipTime(value: string): void {
    this.skipTime = value;
    this.skipTimeChange.emit(value);
  }

  getFeedbackTypeFormArray(feedbackType): UntypedFormArray {
    return this.feedbackForm.get(feedbackType) as UntypedFormArray;
  }

  getControls(feedbackType): AbstractControl[] {
    return this.getFeedbackTypeFormArray(feedbackType).controls;
  }

  getFeedbackObject(feedbackType: string, itemIndex: number): Feedback {
    return this.feedbackObject.feedbacks.find(
      (obj) => obj.feedbacktype === feedbackType && obj.order === itemIndex,
    );
  }

  getFeedbackIndex(feedbackType: string, itemIndex: number): number {
    return this.feedbackObject.feedbacks.findIndex(
      (obj) => obj.feedbacktype === feedbackType && obj.order === itemIndex,
    );
  }

  private resetScreenshotObject() {
    this.screenshot = {
      file: null,
      base64: null,
      index: null,
      tab: null,
      opened: false,
    };
  }

  private resetAudioMessageObject() {
    this.audioMessageRecording = {
      tab: null,
      order: null,
      audio_message: {
        recording: false,
        url: null,
        duration: null,
        language: null,
      },
    };
  }

  public onFileInputChange(files: File[]) {
    this.screenshot.file = files[0];

    this.openCropper();
  }

  private openFileInput() {
    this.screenshotInput.nativeElement.click();
  }

  private handleReaderLoaded(e) {
    this.screenshot.base64 = 'data:image/png;base64,' + btoa(e.target.result);
    this.updateItemInStore(this.screenshot.index, this.screenshot.tab);
  }

  private readScreenshotFile() {
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.screenshot.file);
  }

  private addScreenshotToFeedback(
    feedback: Feedback,
    feedbackType: string,
    itemIndex: number,
  ) {
    this.getControls(feedbackType)
      [itemIndex].get('screenshot')
      .setValue(this.screenshot.base64);
    this.getControls(feedbackType)
      [itemIndex].get('file')
      .setValue(this.screenshot.file);
    feedback.file = this.screenshot.file;
    feedback.screenshot = this.screenshot.base64;
    this.uploadScreenshot(feedback, feedbackType, itemIndex);
  }

  private async uploadScreenshot(
    feedback: Feedback,
    feedbackType: string,
    itemIndex: number,
  ) {
    this.getControls(feedbackType)
      [itemIndex].get('screenshotLoading')
      .setValue(true);
    feedback.screenshotLoading = true;

    this.uploader.addFile({
      data: this.screenshot.file,
      name: this.screenshot.file.name,
      source: 'file input',
      type: this.screenshot.file.type,
    });
    const userId = this.authService.userSubject$.value?.id || ANON_USER_ID;
    this.uploader.setMeta({ folder: `users/${userId}/feedbacks` });
    this.resetScreenshotObject();
    const uploadedFile = await this.uploader.upload();
    this.uploader.reset();
    feedback.screenshot = decodeURIComponent(
      uploadedFile.successful[0].uploadURL,
    );

    this.getControls(feedbackType)
      [itemIndex].get('screenshotLoading')
      .setValue(false);
    this.feedbackObjectUpdate.emit(this.feedbackObject);
    feedback.screenshotLoading = false;
    this.uploader.reset();
  }

  public deleteScreenshot(index: number, tab: string) {
    const feedbackType = tab + 'Items';
    this.getFeedbackTypeFormArray(feedbackType)
      .controls[index].get('screenshot')
      .reset();
    const feedbackIndex = this.getFeedbackIndex(feedbackType, index);
    const feedback = this.feedbackObject.feedbacks[feedbackIndex];
    feedback.screenshot = null;
    this.onKeyupUpdate(index, tab);
  }

  public detectPaste(event: ClipboardEvent, index: number, tab: string) {
    const data = event.clipboardData;
    const file = data.files?.[0];

    if ((file && this.feedbackHasDraw(index, tab)) || !file) {
      return;
    }

    this.screenshot.index = index;
    this.screenshot.tab = tab;
    this.screenshot.file = file;
    this.readScreenshotFile();
  }

  public openScreenshotModal(index: number, tab: string) {
    if (this.screenshot.opened) {
      return;
    }

    this.screenshot.opened = true;
    this.screenshot.index = index;
    this.screenshot.tab = tab;

    this.screenshotDialog = this.dialog.open(ScreenshotModalComponent, {
      backdropClass: 'screenshot-modal-backdrop',
      maxWidth: '90vw',
      width: '360px',
      maxHeight: '90vh',
      minHeight: 'auto',
      scrollStrategy: new NoopScrollStrategy(),
      disableClose: true,
      autoFocus: false,
    });

    this.screenshotDialogSubscription = this.screenshotDialog
      .afterClosed()
      .subscribe(() => {
        this.resetScreenshotObject();
        this.screenshotDialogSubscription.unsubscribe();
      });

    this.screenshotDialogSubscription.add(
      this.screenshotDialog.componentInstance.saveFile.subscribe(async () => {
        const res = await this.onSaveScreenshot();

        if (res === true) {
          this.readScreenshotFile();
          this.screenshotDialog.close();
          return;
        }
        this.snackBar.open(res as string, null, {
          duration: 4000,
        });
      }),
    );

    this.screenshotDialogSubscription.add(
      this.screenshotDialog.componentInstance.openCropper.subscribe(
        async () => {
          const res = await this.onSaveScreenshot();

          if (res === true) {
            this.openCropper();
            return;
          }

          this.snackBar.open(res as string, null, { duration: 4000 });
        },
      ),
    );

    this.screenshotDialogSubscription.add(
      this.screenshotDialog.componentInstance.openBrowser.subscribe(() => {
        this.openFileInput();
      }),
    );
  }

  private async onSaveScreenshot(): Promise<boolean | string> {
    return await new Promise(async (resolve) => {
      try {
        const data = await (navigator as any).clipboard.read();
        const item = data[0];

        if (!item || !/image/.test(item.types[0])) {
          return resolve('No image was found in your clipboard!');
        }

        const blob = await item.getType(item.types[0]);
        this.screenshot.file = blob;

        return resolve(true);
      } catch (err) {
        return resolve(
          'Your browser doesn\'t support this function, please use the "Open file browser" button',
        );
      }
    });
  }

  private openCropper() {
    const dialog = this.dialog.open(CropImageComponent, {
      disableClose: true,
      autoFocus: false,
      maxWidth: '90vw',
      maxHeight: '90vh',
      minHeight: 'auto',
      data: {
        file: this.screenshot.file,
      },
    });

    const subscription = dialog.afterClosed().subscribe((res: string) => {
      if (res) {
        this.screenshot.base64 = res;
        this.updateItemInStore(this.screenshot.index, this.screenshot.tab);
        this.screenshotDialog.close();

        this.fileInput.reset();
      }

      subscription.unsubscribe();
    });
  }

  public audioRecordingStarted(order: number, tab: string) {
    this.audioMessageRecording = {
      order,
      tab,
      audio_message: {
        recording: true,
        url: null,
        duration: null,
        language: null,
      },
    };

    this.rateflowService.audioRecordingStarted = {
      order,
      tab,
      type: 'comment',
    };
    this.handleControlValueChanges(false, order, tab);
  }

  public audioRecordingFinished(
    order: number,
    tab: string,
    event: { url: string; duration: number; language: string },
  ) {
    this.audioMessageRecording = {
      order,
      tab,
      audio_message: {
        recording: false,
        url: event.url,
        duration: event.duration,
        language: event.language,
      },
    };

    this.updateItemInStore(order, tab);
  }

  private addAudioToFeedback(
    feedback: Feedback,
    tab: string,
    itemIndex: number,
  ) {
    const feedbackType = tab + 'Items';
    const value = {
      ...this.audioMessageRecording.audio_message,
      recording: false,
    };
    this.getControls(feedbackType)
      [itemIndex].get('audio_message')
      .setValue(value);
    feedback.audio_message = value;
    this.resetAudioMessageObject();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.rateflowService.avFilePlaybackClickChange$.next(null);
  }
}
