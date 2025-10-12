import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { MetaService } from '@ngx-meta/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, skip, switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { AuthService } from 'src/app/auth/auth.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { User } from 'src/app/shared/models/user.model';
import { Skill } from '../../../../../shared/models/skill.model';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserSkill } from '../../../../../shared/models/UserSkill.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { isArrayAndHasItems } from '../../../../../shared/lib/array-helpers.lib';
import { ResizeService } from '../../../../../services/resize.service';

@Component({
  selector: 'app-profile-info-card',
  templateUrl: './profile-info-card.component.html',
  styleUrls: ['./profile-info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoCardComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @ViewChild('buttonElement', { static: false }) buttonElement: ElementRef;
  @Input() isContainedMode = false;
  // @Input() user: User;
  @Input() currentUser: User;
  @Input() pickedSkill: UserSkill;
  aboutMeForm = new UntypedFormGroup({
    title: new UntypedFormControl('', [Validators.minLength(50)]),
    description: new UntypedFormControl('', [Validators.minLength(500)]),
  });

  @Output() selectedSkill: EventEmitter<Skill> = new EventEmitter<Skill>();

  public switchSubscription = signal<boolean>(false);

  urlIsCopied: boolean;
  referralLink: string;
  isExpand = false;

  readonly userProfile = toSignal(this._profileService.publicProfile$);
  readonly isOrganizationMember = computed(() =>
    this.userProfile().isOrganizationMember(),
  );
  readonly hasActivities = computed(
    () => this.userProfile()?.activity_score.hasActivity() || false,
  );
  readonly isMediumMaxWidth = toSignal(this._resizeService.isMediumMaxWidth$);
  readonly collapsed = signal<boolean>(this.isMediumMaxWidth());

  // readonly hasExpertise = computed(() => )
  constructor(
    public authService: AuthService,
    private rateflowService: RateflowService,
    private readonly metaService: MetaService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private readonly translationService: TranslateService,
    private readonly _profileService: ProfileService,
    private readonly _resizeService: ResizeService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT)
    private readonly _appDocument: Document,
  ) {
    super();
    this.translationService.store.onLangChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((lang: LangChangeEvent) => {
        this.translationService.use(lang.lang);
      });
    this.handleSwitchEmailNotification();

    effect(
      () => {
        this.collapsed.set(this.isMediumMaxWidth());
      },
      { allowSignalWrites: true },
    );
  }

  collapseClickHandler() {
    this.collapsed.set(!this.collapsed());
  }

  public handleSwitchEmailNotification(): void {
    toObservable(this.switchSubscription)
      .pipe(
        skip(1),
        takeUntil(this.destroyed),
        switchMap(() =>
          this.authService.switchEmailNotification().pipe(
            catchError((error) => {
              this.errorSnackBar();
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe((res) => {
        if (!res.success) {
          this.errorSnackBar();
        } else {
          this.snackBar.open('Subscription email notification updated!', null, {
            duration: 3000,
          });
        }
      });
  }

  ngOnInit(): void {
    // const originUrl = window.location.origin;
    // this.referralLink = `${this._appDocument.location.origin}/${PROFILE_PATH}/${this.user.sharetoken}`;
    // this.switchSubscription.set(this.currentUser?.conversations_muted);
    // this.authService.userSubject$
    //   .pipe(
    //     tap((user) => {
    //       this.currentUser = user;
    //       if (this.user?.id !== this.currentUser?.id) {
    //         this.aboutMeForm.patchValue(this.user.about);
    //         this.aboutMeForm.disable();
    //         return;
    //       }
    //       this.aboutMeForm.enable();
    //       this.aboutMeForm.patchValue(user.about);
    //     }),
    //     takeUntil(this.destroyed),
    //   )
    //   .subscribe();
    //
    // this.breakpointObserver
    //   .observe('(max-width: 600px)')
    //   .pipe(takeUntil(this.destroyed))
    //   .subscribe((res) => {
    //     this.isExpand = !res.matches;
    //   });
    // this.setMetaTags();
  }

  selectSkill(skill: UserSkill): void {
    this.selectedSkill.emit(skill);
  }

  updateUserInfo(): void {
    const { title, description } = this.aboutMeForm.value;
    // if ((title.length || description.length) && this.aboutMeForm.dirty) {
    //   this.authService
    //     .updateUser({ ...this.user, about: { title, description } })
    //     .pipe(takeUntil(this.destroyed))
    //     .subscribe();
    // }
  }

  private setMetaTags(): void {
    // const { title, description, image, url } = getUserSeoData(this.user);
    // this.metaService.setTitle(title);
    // this.metaService.setTag('og:description', description);
    // this.metaService.setTag('og:url', url);
    // this.metaService.setTag('og:image', image);
    //
    // this.metaService.setTag('twitter:title', title);
    // this.metaService.setTag('twitter:description', description);
    // this.metaService.setTag('twitter:url', url);
    // this.metaService.setTag('twitter:image', image);
  }

  addToAdvisorsDidClick() {
    // if (!this.authService.userIsSignedIn()) {
    //   this.dialog.open(SignUpMessageComponent, {
    //     maxWidth: '350px',
    //     width: '100vw',
    //     maxHeight: '510px',
    //     height: '100vh',
    //     autoFocus: false,
    //     panelClass: 'sign-up-message-modal',
    //     data: 'Adding Connectors is only possible for registered creatives.',
    //   });
    //
    //   return;
    // }
    // if (this.currentUser.adviserIDs?.includes(this.user.id)) {
    //   this.currentUser.adviserIDs = this.currentUser.adviserIDs.filter(
    //     (obj) => obj !== this.user.id,
    //   );
    //
    //   this.rateflowService
    //     .removeAdviserFromFavorites(this.user.id, this.currentUser.id)
    //     .subscribe();
    //   return;
    // }
    //
    // this.rateflowService
    //   .addAdviserToFavorites(this.user.id, this.currentUser.id)
    //   .subscribe(() => {
    //     this.currentUser.adviserIDs.push(this.user.id);
    //   });
  }

  copyUrl() {
    this.urlIsCopied = true;
  }

  expand(): void {
    this.isExpand = !this.isExpand;
  }

  private errorSnackBar(): void {
    this.snackBar.open('Something went wrong! please try again later', null, {
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // this.metaService.setTitle('Give Feedback');
    // this.metaService.setTag('description', 'Join now to improve your skills');
    // this.metaService.setTag('og:url', 'https://getme.global');
    // this.metaService.setTag('og:image', 'https://efwfileupload.s3-accelerate.amazonaws.com/favi/fbimage.png');
  }
}
