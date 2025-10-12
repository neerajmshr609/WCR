import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';
import {
  UntypedFormControl,
  NgForm,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { EMPTY, forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  mergeMap,
  startWith,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { animate, style, transition, trigger } from '@angular/animations';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Projectadvisor } from 'src/app/shared/models/Projectadvisor.model';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { Invite } from 'src/app/shared/models/invite.model';
import { Presenterquestion } from 'src/app/shared/models/presenterquestion.model';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { Skill } from 'src/app/shared/models/skill.model';
import { User } from 'src/app/shared/models/user.model';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { FilePreviewOverlayService } from 'src/app/services/file-preview-overlay.service';
import { ProjectService } from 'src/app/services/project.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { DOCUMENT } from '@angular/common';
import truncateMiddle from 'truncate-middle';
import { IframelyResponse } from 'src/app/shared/models/iframely-response';
import { IframelyService } from 'src/app/services/iframely.service';
import { AwsS3 } from 'uppy';
import { Uppy } from '@uppy/core';
import { ISODurationToSeconds } from 'src/app/shared/functions/iso-duration-to-seconds';
import { Options } from '@angular-slider/ngx-slider';
import { SeoService } from 'src/app/services/seo.service';
import { COMPANION_URL } from 'src/config/config';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { ProjectSkill } from 'src/app/shared/models/ProjectSkill.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatChipInputEvent } from '@angular/material/chips';
import { SkillsService } from '../../../services/skill/skills.service';

@Component({
  templateUrl: 'error-dialog.html',
})
export class ErrorDialogComponent {
  isModal = false;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { formError: string },
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
  providers: [UploaderService],
})
export class ProjectEditComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  artCategoryControl = new UntypedFormControl();
  emails = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('screenshot', { static: false }) screenshot: ElementRef;
  @ViewChild('uploadForm', { static: true }) uploadForm: NgForm;

  isVideoContainingUpload = false;
  isAudioContainingUpload = false;
  isSaving = false;
  currentUser: User;
  allCategories: Artcategory[];
  allSkills: Skill[];
  projectSkills: Skill[] = [];
  filteredOptions: Observable<Artcategory[]>;

  uploadInChooseTheBestMode = false;
  fileUploadInProgress = false;

  sliderOptions: Options = {
    floor: 0,
    ceil: 50,
    showTicks: true,
    tickStep: 10,
    animateOnMove: true,
  };

  project: Project;
  projectID: number;

  public videoNotFound: boolean;
  public iframeLoading: boolean;
  public iframeError: string;

  readonly ytRegExp = '^(http(s)?://)?((w){3}.)?youtu(be|.be)?(.com)?/.+';
  readonly linkRegExp =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

  public ytLink = new UntypedFormControl(
    null,
    Validators.pattern(this.ytRegExp),
  );
  public iframeLink = new UntypedFormControl(null, [
    Validators.pattern(this.linkRegExp),
    this.duplicateLinkValidator.bind(this),
  ]);
  public dummyLink = new UntypedFormControl(null, [
    Validators.pattern(this.linkRegExp),
    this.duplicateLinkValidator.bind(this),
  ]);

  private currentAdvisors = new Array<Projectadvisor>();
  private currentSkills = new Array<ProjectSkill>();

  private projectFilesToDelete = new Array<Observable<any>>();
  public shareWithFriends = false;
  public isSelfTest = false;

  public isModalOpen: boolean;
  private isPortfolioMode: boolean;
  public showIframe = new EventEmitter<void>();

  public get filteredQuestions() {
    return this.project?.presenterquestions.filter(
      (question) => !question._destroy,
    );
  }

  private errorAVFiles$ = new Subject<number[]>();

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private iframelyService: IframelyService,
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private previewDialog: FilePreviewOverlayService,
    private dialog: MatDialog,
    public transactionsService: TransactionsService,
    private seoService: SeoService,
    private uploaderService: UploaderService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document,
    private skillsService: SkillsService,
  ) {
    super();
  }

  ngOnInit() {
    this.projectID = +this.route.snapshot.params.id;
    this.isPortfolioMode = this.route.snapshot.queryParams.portfolio;

    if (this.projectID) {
      this.projectService
        .fetchProject(this.projectID)
        .pipe(
          takeUntil(this.destroyed),
          catchError((err) => {
            this.router.navigateByUrl('/insights');
            return throwError(err);
          }),
          tap((res) => {
            this.project = res;
            this.currentAdvisors = [...res.projectadvisors];
            this.currentSkills = [...res.project_skills];

            this.sortFiles();
            this.checkIfAVProject();

            this.seoService.setSettings({
              title: res.title || 'Untitled',
              description: 'Edit project',
              keywords: 'Edit Project',
            });

            this.newProjectObject();
          }),
        )
        .subscribe();
    } else {
      this.newProjectObject();
    }
  }

  ngAfterViewInit(): void {
    if (this.isPortfolioMode) {
      setTimeout(() => this.showIframe.emit(), 1500);
    }
  }

  private duplicateLinkValidator(control) {
    if (
      this.project?.projectfiles.find(
        (file) => file.url === control.value && file.mimetype === 'dummy',
      )
    ) {
      return { alreadyExists: true };
    }
    return null;
  }

  private _filter(name: string): Artcategory[] {
    const filterValue = name.toLowerCase();

    return this.allCategories.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) > -1,
    );
  }

  selectedSkillsChanged(projectSkills: Skill[]) {
    this.projectSkills = projectSkills;
  }

  prepareForm() {
    this.skillsService.fetchSkills();
    this.skillsService.skills$
      .pipe(
        takeUntil(this.destroyed),
        filter((skills) => skills.length > 0),
      )
      .subscribe((skills) => {
        this.allSkills = skills;
      });
    this.projectService
      .fetchArtcategories()
      .pipe(takeUntil(this.destroyed))
      .subscribe((categories) => {
        this.allCategories = categories;

        this.filteredOptions = this.artCategoryControl.valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? value : value.name)),
          map((name) =>
            name ? this._filter(name) : this.allCategories.slice(),
          ),
        );

        if (this.projectID) {
          this.artCategoryControl.setValue(
            this.allCategories.find(
              (obj) => obj.id === this.project.artcategory_id,
            ).name,
          );
        }
      });
  }

  onPresenterQuestionAdd() {
    const pq = new Presenterquestion();
    this.project.presenterquestions.push(pq);
  }

  onPresenterQuestionDelete(question: Presenterquestion) {
    const index = this.project.presenterquestions.findIndex(
      (q) => q === question,
    );

    if (!question.id && this.filteredQuestions.length > 1) {
      this.project.presenterquestions.splice(index, 1);
      return;
    }

    this.project.presenterquestions[index]._destroy = true;
    this.changeDetectorRef.detectChanges();
  }

  checkIfAVProject() {
    this.isVideoContainingUpload =
      this.project.projectfiles.filter((fl) => fl.mimetype.includes('video', 0))
        .length > 0;
    this.isAudioContainingUpload =
      this.project.projectfiles.filter((fl) => fl.mimetype.includes('audio', 0))
        .length > 0;
  }

  showAVHowItWorks() {
    this.previewDialog.imageURL = 'assets/av-explainer.jpg';
    this.previewDialog.open();
  }

  showHowItWorks() {
    this.previewDialog.imageURL = 'assets/how-payment-works1.jpg';
    this.previewDialog.open();
  }

  onDelete(file: Projectfile) {
    file.deleting = true;
    const index = this.project.projectfiles.findIndex((f) => f === file);
    const fileId = this.project.projectfiles[index].id;

    if (this.projectID && fileId) {
      this.projectFilesToDelete.push(
        this.projectService.deleteProjectfile(+file.id),
      );
    }
    this.project.projectfiles.splice(index, 1);
  }

  changeTrustedAdvisors(advisors: Projectadvisor[]) {
    this.project.projectadvisors = advisors;
  }

  onProjectModeChange(change: MatRadioChange) {
    this.uploadInChooseTheBestMode = change.value !== '1';
  }

  onTopUp() {
    this.router.navigate(['balance'], { relativeTo: this.route });
  }

  onGiveFeedback() {
    this.router.navigate(['/rateflow']);
  }

  onAddEmail(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if (!value || this.isModalOpen) {
      return;
    }

    if (!this.validateEmail(value)) {
      this.isModalOpen = true;
      const dialogSub = this.dialog
        .open(ErrorDialogComponent, {
          data: { formError: 'email is not valid' },
        })
        .afterClosed()
        .subscribe(() => {
          this.isModalOpen = false;
          dialogSub.unsubscribe();
        });

      return;
    }

    if ((value || '').trim() && !this.emails.includes(value)) {
      this.emails.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  onRemoveEmail(email: string) {
    this.emails = this.emails.filter((obj) => obj !== email);
  }

  paste(event: ClipboardEvent): void {
    event.preventDefault(); // Prevents the default action
    event.clipboardData
      .getData('Text')
      .split(/;|,|\n/)
      .forEach((data) => {
        const value = data.trim();

        if (value) {
          if (!this.validateEmail(value)) {
            this.dialog.open(ErrorDialogComponent, {
              data: { formError: 'email is not valid' },
            });

            return;
          }

          if (!this.emails.includes(data)) {
            this.emails.push(value);
          }
        }
      });
  }

  onSubmit(uploadForm: NgForm, publish?: boolean) {
    if (
      !this.uploadInChooseTheBestMode &&
      this.shareWithFriends &&
      !this.emails.length
    ) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          formError:
            'We require at least 1 email and your name if you decided to invite friends',
        },
      });
      return;
    }

    if (!this.artCategoryControl.value) {
      this.dialog.open(ErrorDialogComponent, {
        data: { formError: 'We require project category' },
      });

      return;
    }

    if (this.isVideoContainingUpload || this.isAudioContainingUpload) {
      const isAV = (file: Projectfile) =>
        file.mimetype.includes('audio') || file.mimetype.includes('video');

      const errorAVFiles = this.project.projectfiles
        .map((_, i) => i)
        .filter((i) => {
          const file = this.project.projectfiles[i];
          return (
            isAV(file) &&
            !file.avratingparams.filter((param) => param.name).length
          );
        });
      this.errorAVFiles$.next(errorAVFiles);
      if (errorAVFiles.length) {
        this.snackBar.open(
          'We require at least 1 feedback parameter for your audio / video files',
          null,
          {
            duration: 4000,
          },
        );
        return;
      }

      const colors = ['green', 'mustard', 'blue'];
      this.project.projectfiles
        .filter((file) => isAV(file))
        .forEach((file) => {
          file.avratingparams = file.avratingparams.map((param, index) => ({
            ...param,
            color: colors[index],
          }));
        });
    }

    const category = this.allCategories.find(
      (element: Artcategory) => element.name === this.artCategoryControl.value,
    );

    if (!category) {
      this.dialog.open(ErrorDialogComponent, {
        data: { formError: 'Not a valid category selected' },
      });

      return;
    }

    this.isSaving = true;
    this.project.artcategory_id = category.id;

    this.project.invites = this.emails.map(
      (email) =>
        new Invite(
          uploadForm.value.inviteName,
          uploadForm.value.inviteText,
          email,
        ),
    );
    this.project.projectfiles.forEach(
      (file, index) => (file.order = index + 1),
    );
    this.project.private =
      !this.project.show_in_give_feedback && !this.project.show_in_public_feed;
    this.project.published = !!publish;

    // delete last element in array - title: 'Type your question...'
    this.project.presenterquestions.pop();

    if (this.shareWithFriends) {
      const element: HTMLElement = this.screenshot.nativeElement;
      html2canvas(element, {
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      }).then((canvas) => {
        canvas.toBlob(async (blob) => {
          const uploader = new Uppy({ id: 'screenshot-uploader' }).use(AwsS3, {
            companionUrl: COMPANION_URL,
            metaFields: ['folder'],
          });

          uploader.addFile({
            data: blob,
            name: new Date().getTime() + 'project_screenshot.jpg',
            type: 'image/jpeg',
          });

          uploader.setMeta({
            folder: `users/${this.authService.userSubject$.value.id}/projects`,
          });
          const uploadedFiles = await uploader.upload();
          uploader.reset();

          this.project.preview = decodeURIComponent(
            uploadedFiles.successful[0].uploadURL,
          );
          this.updateProject();
        }, 'image/jpeg');
      });
    } else {
      this.updateProject();
    }
  }

  navigateToInsights(isEdit = null) {
    this.analyticsService.trackEvent('Upload', 'success');
    this.isSaving = false;
    this.router.navigate(['insights'], {
      relativeTo: this.route.root,
      queryParams: { projecttoken: this.project.sharetoken, isEdit },
    });
  }

  getProjectSkillsRequests() {
    const calls = [of({})];

    this.projectSkills.forEach((skill) => {
      if (
        !this.project.project_skills.find(
          (projectSkill) => projectSkill.skill.id === skill.id,
        )
      ) {
        calls.push(
          this.skillsService.createProjectSkill(this.project.id, skill.id),
        );
      }
    });

    this.currentSkills.forEach((skill) => {
      if (
        !this.projectSkills.find(
          (projectSkill) => projectSkill.id === skill.skill.id,
        )
      ) {
        calls.push(this.skillsService.deleteProjectSkill(skill.id));
      }
    });

    return calls;
  }

  private updateProject(): void {
    const action = this.projectID ? 'updateProject' : 'addProject';

    this.projectService[action](this.project)
      .pipe(
        mergeMap((res: Project) => {
          this.project = { ...res, ...this.project };
          const requests = [of(null), ...this.projectFilesToDelete];

          if (
            this.project.projectadvisors.length ||
            this.currentAdvisors.length
          ) {
            requests.push(
              this.projectService.updateProjectAdvisors(
                this.project,
                this.currentAdvisors,
              ),
            );
          }

          if (this.projectSkills.length) {
            requests.push(...this.getProjectSkillsRequests());
          }

          return forkJoin(requests);
        }),
        tap(() => this.navigateToInsights(true)),
        finalize(() => (this.isSaving = false)),
        catchError((err: HttpErrorResponse) => {
          const text = err.error;
          this.dialog.open(ErrorDialogComponent, {
            data: {
              formError:
                text && typeof text === 'string'
                  ? text
                  : `Error while ${this.projectID ? 'updating' : 'adding'} a project`,
            },
          });
          return throwError(err);
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  sortFiles() {
    this.project.projectfiles.sort((a, b) => a.order - b.order);
    this.project.projectfiles_attributes.sort((a, b) => a.order - b.order);
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  clearFormControl(formControl: AbstractControl) {
    formControl.reset();
  }

  onAddYoutube() {
    this.videoNotFound = false;
    let ytVideo = new Projectfile();

    this.projectService
      .getYoutubeVideoInfo(this.ytLink.value)
      .pipe(
        takeUntil(this.destroyed),
        tap((res: any) => {
          if (!res) {
            this.videoNotFound = true;
            return;
          }

          // prevent adding same video twice
          if (
            this.project.projectfiles
              .map((file) => file.handle)
              .includes(res.id)
          ) {
            return;
          }

          ytVideo = {
            name: res.snippet.title,
            handle: res.id,
            mimetype: 'video/youtube',
            url: 'https://www.youtube.com/watch?v=' + res.id,
            duration: ISODurationToSeconds(res.contentDetails.duration),
          };

          this.ytLink.reset();
          this.isVideoContainingUpload = true;
        }),
        mergeMap((res) => {
          const src = `https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`;
          return this.projectService.getImage(src).pipe(
            tap(() => {
              ytVideo.thumbnail = src;
              this.addProjectFile(ytVideo);
            }),
            catchError(() => {
              ytVideo.thumbnail = res.snippet.thumbnails.medium.url;
              this.addProjectFile(ytVideo);
              return EMPTY;
            }),
          );
        }),
      )
      .subscribe();
  }

  private addProjectFile(file: Projectfile) {
    this.project.projectfiles.push({ ...file, showinfo: true });
  }

  onAddIframe() {
    this.iframeLoading = true;
    this.iframeError = null;

    this.iframelyService
      .getIframe(this.iframeLink.value)
      .pipe(
        takeUntil(this.destroyed),
        catchError((err: HttpErrorResponse) => {
          this.iframeError = err.error.error || 'Error';
          return throwError(err);
        }),
        finalize(() => (this.iframeLoading = false)),
      )
      .subscribe((data: IframelyResponse) => {
        const handle = this.iframeLink.value.replace(/[\W]+/g, '');

        if (
          this.project.projectfiles.map((file) => file.handle).includes(handle)
        ) {
          return;
        }

        const iframe = new Projectfile(
          data.title,
          handle,
          'text/html',
          data.url,
        );
        iframe.thumbnail = data.thumbnail_url;
        this.iframeLink.reset();
        this.addProjectFile(iframe);
      });
  }

  public onAddDummy(): void {
    const handle = this.dummyLink.value.replace(/[\W]+/g, '');
    const projectFile = new Projectfile(
      'Unspecified Link ' +
        (this.project.projectfiles.filter((file) => file.mimetype === 'dummy')
          .length +
          1),
      handle,
      'dummy',
      this.dummyLink.value,
    );
    this.dummyLink.reset();
    this.addProjectFile(projectFile);
  }

  private initUploader(): void {
    this.changeDetectorRef.detectChanges();
    const id = this.projectID
      ? 'uploader--edit-project'
      : 'uploader--add-project';
    this.uploaderService.uploaderConfig = {
      id,
      target: id,
      inline: true,
      dropPasteImport:
        'You can upload one or multiple files including images, audio, video and PDF. Just drop files here, paste, %{browse} or import from:',
    };
    this.uploaderService.init();
    this.uploaderService.options = {
      restrictions: {
        allowedFileTypes: [
          'image/*',
          '.jpg',
          '.jpeg',
          '.png',
          '.gif',
          'video/*',
          '.mkv',
          'audio/*',
          'application/pdf',
        ],
      },
    };
    this.uploaderService.meta = {
      folder: `users/${this.authService.userSubject$.value.id}/projects`,
    };

    this.uploaderService.fileUploaded
      .pipe(
        takeUntil(this.destroyed),
        filter(() => !this.fileUploadInProgress),
      )
      .subscribe(async (res) => {
        const uploadedFile = res.file;
        const extension = '.' + uploadedFile.extension;
        const url = res.url;

        const file = new Projectfile(
          uploadedFile.name.split(extension).slice(0, -1).join(extension),
          uploadedFile.meta.id,
          uploadedFile.type,
        );

        file.url = url;

        if (file.mimetype.includes('audio')) {
          this.isAudioContainingUpload = true;
        }

        if (file.mimetype.includes('video')) {
          this.isVideoContainingUpload = true;
        }

        if (file.mimetype.includes('image')) {
          file.thumbnail = url;
          const img = new Image();
          img.onload = () => {
            file.width = img.width;
            file.height = img.height;
            this.addProjectFile(file);
          };
          img.src = url;
        } else {
          this.addProjectFile(file);
        }
      });

    this.uploaderService.uploadStarted
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        const elems = this.document.querySelectorAll(
          '.uppy-Dashboard-Item-name',
        );
        elems.forEach((elem, index) => {
          const files = this.uploaderService.files;

          elem.classList.add('processed');
          const name = truncateMiddle(files[index].name, 14, 13, '...');
          elem.setAttribute('data-name', name);
          elem.setAttribute('title', name);
        });
      });
  }

  newProjectObject() {
    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        take(1),
        tap((user) => {
          this.currentUser = user;

          if (!this.projectID) {
            this.project = {
              user_id: this.currentUser.id,
              show_in_give_feedback: true,
              show_in_public_feed: true,
              published: false,
              inspiringrate: 12,
              presenterquestions: [],
              projectfiles: [],
              projectadvisors: [],
              project_skills: [],
              feedback_focus_area: { x: 50, y: 60 },
            };
          }

          this.initUploader();
          this.prepareForm();
          this.project.presenterquestions.push(new Presenterquestion());
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  public applyToAllFiles(selectedFile: Projectfile) {
    const type = selectedFile.mimetype.includes('audio') ? 'audio' : 'video';
    const files = this.project.projectfiles.filter((file) =>
      file.mimetype.includes(type),
    );

    files.forEach((file) => {
      const ids = file.avratingparams.map((param) => param.id);
      file.avratingparams = selectedFile.avratingparams.map((param, index) => ({
        ...param,
        id: ids[index],
      }));
    });
  }

  public changeToggle(type: 'show_in_give_feedback' | 'show_in_public_feed') {
    this.project[type] = !this.project[type];
  }

  ngOnDestroy(): void {
    this.uploaderService.destroy();
    super.ngOnDestroy();
  }
}
