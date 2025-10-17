import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { fromEvent, throwError, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {
  catchError,
  debounceTime,
  delay,
  filter,
  finalize,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { SeoService } from '../services/seo.service';
import { OnlineService } from '../services/online.service';
import { WebsocketService } from '../services/websocket.service';
import { BaseComponent } from '../shared/components/base.component';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { OrganizationService } from '../services/organization.service';
import { OrganizationShort } from '../shared/models/organizationShort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ResizeService } from '../services/resize.service';
import { SignupDTO } from './model/sign-up-dto.interface';
import { OutletService } from '../services/outlet.service';
import { DOCUMENT } from '@angular/common';
import { AuthMode } from './model/auth-mode';
import { isOutside } from '../shared/lib/native-dom-js.helpers';
import { MouseEventWithHtmlTarget } from '../shared/lib/ts-utils.lib';
import { MatDialog } from '@angular/material/dialog';
import { CheckEmailModalComponent } from './check-email-modal/check-email-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { passwordComplexityValidator } from '../shared/validators/password.validator';
import { FooterService } from '../services/footer/footer.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

export type SIGNUP_MODE = 'client' | 'counsellor';

const rippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0,
  },
};

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: rippleConfig },
    OrganizationService,
  ],
  animations: [
    trigger('slideTop', [
      state('false', style({ bottom: '-541px' })),
      state('true', style({ bottom: '0px' })),
      transition('false => true', animate('300ms ease-out')),
    ]),
  ],
})
export class AuthComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('authRef') private authRef: ElementRef;

  public form = new UntypedFormGroup({
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]),
  });
  public isEnterCompanyName = signal(false);

  signUpMode = signal<SIGNUP_MODE>('client');
  readonly authMode = input<AuthMode>('login');
  readonly restrictSwitchMode = input<boolean>(false);
  readonly predefinedEmail = input<string>();
  readonly predefinedOrganization =
    input<Pick<OrganizationShort, 'id' | 'legal_name'>>();
  readonly submitWithoutOrganization = input<boolean>(false);

  public organizationsControl = new FormControl(null, []);

  public isLoginMode: boolean;
  public isSignupMode: boolean;
  public isPasswordResetMode: boolean;

  public title = signal<string>(null);
  public error = signal<string>(null);

  public shouldShowResendConfirmation: boolean;
  public isLoading: boolean;

  public showIframe = new EventEmitter();

  public termsLink = `${environment.baseUrl}terms`;
  public organizations = signal<OrganizationShort[]>([]);
  public organizationsInitValue = signal<OrganizationShort[]>([]);

  public imgSrc: string;
  private returnUrl: string;
  public startAnimations = signal(false);
  private forceAnimations = signal(false);
  public hideCompany = signal(false);
  private isDesktop = signal(null);
  private destroyRef = inject(DestroyRef);
  showPassword: boolean = false;
  showNewPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private onlineService: OnlineService,
    private webSocketService: WebsocketService,
    private organizationService: OrganizationService,
    private readonly languageService: LanguageService,
    private readonly translateService: TranslateService,
    private resizeService: ResizeService,
    readonly outletService: OutletService,
    @Inject(DOCUMENT)
    private readonly _document: Document,
    private readonly _authComponentRef: ElementRef,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private footerService: FooterService,
  ) {
    super();
    this.resizeService.isDesktop$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isDesktop) => {
        this.isDesktop.set(isDesktop);
        if (isDesktop) {
          this.footerService.displayFooter();
        } else {
          this.footerService.hideFooter();
        }
      });

    effect(() => {
      this.translateService.use(this.languageService.currentLanguageCode());
    });

    effect(() => {
      const predefinedEmail = this.predefinedEmail();
      if (predefinedEmail) {
        this.form.get('email')?.setValue(predefinedEmail);
      }
    });

    effect(
      () => {
        const predefinedOrganization = this.predefinedOrganization();
        if (predefinedOrganization) {
          this.organizationsControl.setValue(predefinedOrganization.legal_name);
          this.organizationsControl.disable();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const inputMode = this.authMode();
        this.switchMode(inputMode);
        this.reinit();
      },
      { allowSignalWrites: true },
    );
  }

  ngAfterViewInit(): void {
    this._subscribeClosingModal();
  }

  ngOnInit() {
    this.hideCompany.set(
      JSON.parse(this.route.snapshot.queryParamMap.get('hide_company')),
    );

    this.resizeService.resize$
      .pipe(debounceTime(100), skip(1), delay(200))
      .subscribe((res) => {
        this.handleAnimate(res);
      });

    this.getReturnUrl();
    this.switchMode(this.authMode());
    this.sharedService.isAuthPage$.next(true);
    if (this.predefinedOrganization()) {
      this.organizationSelected(this.predefinedOrganization()?.legal_name);
    } else {
      this.getAllOrganization();
      this.filteringOrganization();
    }
  }

  private reinit() {
    this.initForm();
    this.getImgSrc();
  }

  private initForm() {
    this.form.removeControl('newPassword');
    this.form.removeControl('password');
    this.form.removeControl('isteam');
    this.form.removeControl('username');
    this.form.removeControl('accepted');
    this.form.removeControl('organization');
    this.form.removeControl('organization_name');
    if (this.isLoginMode) {
      this.form.addControl(
        'password',
        new UntypedFormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      );
    }
    if (this.isSignupMode) {
      this.form.addControl(
        'password',
        new UntypedFormControl(null, [
          Validators.required,
          Validators.minLength(6),
          passwordComplexityValidator(),
        ]),
      );
      this.form.addControl(
        'username',
        new UntypedFormControl(null, [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9_]*$/),
        ]),
      );

      this.form.addControl(
        'accepted',
        new FormControl(false, [Validators.required]),
      );
    }

    if (
      !this.hideCompany() &&
      this.isSignupMode &&
      this.signUpMode() === 'counsellor'
    ) {
      this.form.addControl(
        'organization',
        new UntypedFormControl(
          this.predefinedOrganization()?.legal_name || null,
          [],
        ),
      );

      this.form.addControl('organization_name', new UntypedFormControl(null));
    }
    this.cdr.detectChanges();
  }

  private getImgSrc() {
    this.imgSrc = 'assets/auth/';

    if (this.isLoginMode) {
      this.imgSrc += 'sign-in.svg';
    } else if (this.isPasswordResetMode) {
      this.imgSrc += 'reset-password.svg';
    } else {
      this.imgSrc += 'sign-up.svg';
    }
  }

  private getReturnUrl() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  private setMeta(): void {
    const metaData = this.route.snapshot.data[this.authMode()]?.meta;
    if (metaData) {
      this.seoService.setSettings(metaData);
    }
  }

  private switchMode(mode: AuthMode): void {
    const isCounsellor = this.signUpMode() === 'counsellor';
    const titleKey = isCounsellor
      ? 'header.counsellor-sign-up'
      : 'header.sign-up';
    this.isSignupMode = false;
    this.isLoginMode = false;
    this.isPasswordResetMode = false;
    switch (mode) {
      case 'signup':
        this.translateService
          .get(titleKey)
          .pipe(take(1))
          .subscribe((res: string) => this.title.set(res));
        this.isSignupMode = true;
        this.isLoginMode = false;
        this.isPasswordResetMode = false;
        timer(300)
          .pipe(take(1))
          .subscribe(() => {
            this.handleAnimate();
          });
        break;
      case 'login':
        this.translateService
          .get('header.sign-in')
          .pipe(take(1))
          .subscribe((res: string) => this.title.set(res));
        this.isLoginMode = true;
        this.isSignupMode = false;
        this.isPasswordResetMode = false;
        timer(300)
          .pipe(take(1))
          .subscribe(() => {
            this.handleAnimate();
          });
        break;
      case 'reset-password':
        this.isPasswordResetMode = true;
        this.isLoginMode = false;
        this.startAnimations.set(false);
        this.isSignupMode = false;
        this.translateService
          .get('header.reset')
          .pipe(take(1))
          .subscribe((res: string) => this.title.set(res));
        break;
      default:
        throw new Error("Mode doesn't exist");
    }

    this.setMeta();

    if (this.isSignupMode || this.isLoginMode) {
      const queryParams = this.route.snapshot.queryParams;
      if (queryParams.email) {
        const emailField = this.form.get('email');
        emailField.setValue(queryParams.email);
        emailField.disable();
      }
    }
  }

  switchModeHandler(mode: AuthMode): void {
    if (!this.restrictSwitchMode() && this.authMode() !== mode) {
      this.authService.openAuthForm(mode, { returnUrl: this.returnUrl });
    }
  }

  didRequestConfirmation(email: string) {
    this.authService
      .requestConfirmationEmail(email)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.error.set('Confirmation email sent to ' + email);
      });
  }

  onSubmit() {
    this.isLoading = true;

    if (this.isPasswordResetMode) {
      this.resetPassword();
      return;
    }

    if (this.isLoginMode) {
      this.signin();
      return;
    }

    this.signup();
  }

  resetPassword() {
    const email = this.form.value.email;

    this.authService
      .resetPassword(email)
      .pipe(
        takeUntil(this.destroyed),
        catchError((err) => {
          this.error.set(err.error.errors?.full_messages[0]);
          return throwError(err);
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((res: { message: string }) => {
        this.title.set(res.message);
        this.snackBar.open(
          'The link to change your password has been sent to your email. It can take up to 10 minutes.',
          null,
          {
            duration: 3000,
          },
        );
      });
  }

  private navigate(): void {
    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
      if (this.returnUrl) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  signin() {
    if (this.form.invalid) {
      return;
    }
    this.webSocketService.closeConnection();
    const value = this.form.value;

    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      value.invite_token = token;
    }

    this.authService
      .login(value)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.isLoading = false)),
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.error.errors?.[0]);
          this.shouldShowResendConfirmation =
            this.error()?.includes('confirmation') || false;
          return throwError(err);
        }),
        tap(() => {
          this.form.reset();
          this.navigate();
        }),
        switchMap(() => this.onlineService.subscribeToOnline()),
      )
      .subscribe();
  }

  signup() {
    if (
      this.form.invalid ||
      (this.form.get('accepted') && this.form.get('accepted')?.value === false)
    ) {
      return;
    }
    const value = this.form.getRawValue();
    const body: SignupDTO = {
      email: value.email,
      username: value.username,
      password: value.password,
      accepted: value.accepted,
    };
    const token = this.route.snapshot.paramMap.get('token');
    if (value.organization && !this.submitWithoutOrganization()) {
      body.org_id = value.organization.id;
    }
    if (this.signUpMode() === 'counsellor' && value.organization_name) {
      body.organization_name = value.organization_name;
    }
    if (token) {
      body.invite_token = token;
    }

    this.authService
      .signUp(body)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.isLoading = false)),
        catchError((err: HttpErrorResponse) => {
          this.error.set(
            err?.error?.error || err?.error?.errors?.full_messages[0],
          );
          return throwError(err);
        }),
      )
      .subscribe(() => {
        this.form.reset();
        this.router.navigate([{ outlets: { modal: null } }]);
        this.router.navigate(['home']);
        this.dialog.open(CheckEmailModalComponent, {
          data: { email: value.email },
          panelClass: 'wcr-modal',
          maxWidth: '590px',
          width: '100%',
        });
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sharedService.isAuthPage$.next(false);
    if (!this.isDesktop()) {
      this.footerService.displayFooter();
    }
  }

  public organizationSelected(value: string): void {
    if (!this.predefinedOrganization()) {
      this.form.get('organization').setValue(value);
    }
  }

  private getAllOrganization(): void {
    if (this.isSignupMode) {
      this.organizationService
        .getOrganizationsList()
        .subscribe((organizations) => {
          this.organizations.set(organizations);
          this.organizationsInitValue.set(organizations);
          this.signupByToken();
        });
    }
  }

  private filteringOrganization(): void {
    if (this.isSignupMode) {
      this.organizationsControl.valueChanges
        .pipe(takeUntil(this.destroyed))
        .subscribe((find) => {
          const organizations = this.organizationsInitValue();
          this.organizations.set(
            organizations.filter((org) =>
              org.legal_name.toLowerCase().includes(find.toLowerCase()),
            ),
          );
        });
    }
  }

  public signupByToken(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (!queryParams.token) {
      return;
    }
    const orgId = queryParams.organization;
    if (orgId) {
      const org = this.organizations().find((org) => org.id === +orgId);
      if (org) {
        const orgField = this.form.get('organization');
        orgField.setValue(org);
        orgField.disable();
        this.organizationsControl.setValue(org.legal_name);
        this.organizationsControl.disable();
      }
    }
  }

  private handleAnimate(size = window.innerWidth): void {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (size < 768 && isPortrait) {
      this.startAnimations.set(true);
    } else {
      this.startAnimations.set(false);
    }
  }

  private _subscribeClosingModal(): void {
    fromEvent<MouseEvent>(this._document, 'mouseup')
      .pipe(
        filter(
          (event: MouseEventWithHtmlTarget) =>
            isOutside(event, this._authComponentRef) &&
            this.isNotDropdownElement(event.target),
        ),
        take(1),
      )
      .subscribe(() => {
        this.outletService.closeModalOutlet();
      });
  }

  private isNotDropdownElement(target: HTMLElement): boolean {
    return (
      !target.classList.contains('option') &&
      !target.classList.contains('cdk-overlay-pane') &&
      !target.classList.contains('create-new-company') &&
      !target.classList.contains('create-new-company-btn') &&
      !target.classList.contains('btn-entity') &&
      !target.classList.contains('autocomplete')
    );
  }

  public setCounsellorSignUp(): void {
    this.signUpMode.set('counsellor');
  }

  public setClientSignUp(): void {
    this.signUpMode.set('client');
  }

  public switchCompanySelect(dropdown): void {
    this.isEnterCompanyName.set(true);
    if (dropdown) {
      dropdown.close();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }
}
