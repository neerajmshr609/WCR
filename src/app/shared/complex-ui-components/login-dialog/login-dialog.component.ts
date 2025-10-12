import {
  Component,
  effect,
  EventEmitter,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { BaseComponent } from '../../components/base.component';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { OrganizationShort } from '../../models/organizationShort';
import { AuthService } from '../../../auth/auth.service';
import { OnlineService } from '../../../services/online.service';
import { WebsocketService } from '../../../services/websocket.service';
import { OrganizationService } from '../../../services/organization.service';
import { LanguageService } from '../../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  catchError,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AutocompleteModule } from '../../UIkit/autocomplete/autocomplete.module';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { CoreModule } from '../../modules/core.module';
import { InputComponent } from '../../UIkit/input/input.component';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { SearchIconComponent } from '../../icons/search-icon/search-icon.component';
import { SmallSpinnerModule } from '../../components/small-spinner/small-spinner.module';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { createForChildProviderConfig } from '../../app-language/translate-module-provider-config.factory';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CONVERSATIONS_PATH } from '../../../pages/conversations/conversations-routing.module';
import { Router } from '@angular/router';
import { SignupDTO } from '../../../auth/model/sign-up-dto.interface';
import { passwordComplexityValidator } from '../../validators/password.validator';

const rippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0,
  },
};

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: rippleConfig },
    OrganizationService,
    TranslateModule.forChild(createForChildProviderConfig('auth')).providers,
  ],
  imports: [
    AutocompleteModule,
    ButtonComponent,
    CoreModule,
    InputComponent,
    MatButton,
    MatCheckbox,
    NgIf,
    ReactiveFormsModule,
    SearchIconComponent,
    SmallSpinnerModule,
    TranslateModule,
  ],
})
export class LoginDialogComponent extends BaseComponent implements OnInit {
  public form = new UntypedFormGroup({
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]),
  });

  public organizationsControl = new FormControl(null, []);

  public isLoginMode: boolean;
  public isSignupMode: boolean;
  public isPasswordResetMode: boolean;

  public error: string;

  public shouldShowResendConfirmation: boolean;
  public isLoading: boolean;

  public showIframe = new EventEmitter();

  public termsLink = `${environment.baseUrl}terms`;
  public organizations = signal<OrganizationShort[]>([]);
  public organizationsInitValue = signal<OrganizationShort[]>([]);
  private conversationId = signal<number>(null);

  constructor(
    private authService: AuthService,
    private onlineService: OnlineService,
    private webSocketService: WebsocketService,
    private organizationService: OrganizationService,
    private readonly languageService: LanguageService,
    private readonly translateService: TranslateService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { conversationId: number },
  ) {
    super();
    effect(() => {
      this.translateService.use(this.languageService.currentLanguageCode());
    });
    this.conversationId.set(data.conversationId);
  }

  ngOnInit() {
    this.switchMode('login');
    this.initForm();
    this.getAllOrganization();
    this.filteringOrganization();
  }

  private initForm() {
    this.form.removeControl('newPassword');
    this.form.removeControl('password');
    this.form.removeControl('isteam');
    this.form.removeControl('username');
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
        'newPassword',
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
      this.form.addControl('organization', new UntypedFormControl(null, []));
      this.form.addControl(
        'accepted',
        new FormControl(false, [Validators.required]),
      );
    }
  }

  private switchMode(mode: string): void {
    this.isSignupMode = false;
    this.isLoginMode = false;
    this.isPasswordResetMode = false;
    switch (mode) {
      case 'signup':
        this.isSignupMode = true;
        this.isLoginMode = false;
        this.isPasswordResetMode = false;
        break;
      case 'login':
        this.isLoginMode = true;
        this.isSignupMode = false;
        this.isPasswordResetMode = false;
        break;
      case 'resetpassword':
        this.isPasswordResetMode = true;
        this.isLoginMode = false;
        this.isSignupMode = false;
        break;
      default:
        throw new Error("Mode doesn't exist");
    }
  }

  onSwitchMode(mode: string): void {
    this.switchMode(mode);
    this.initForm();
  }

  didRequestConfirmation(email: string) {
    this.authService
      .requestConfirmationEmail(email)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.error = 'Confirmation email sent to ' + email;
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
          this.error = err.error.errors?.[0];
          return throwError(err);
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }

  signin() {
    if (this.form.invalid) {
      return;
    }
    this.webSocketService.closeConnection();
    const value = {
      ...this.form.value,
      conversation_id: this.conversationId(),
    };

    this.authService
      .login(value)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.isLoading = false)),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.errors?.[0];
          this.shouldShowResendConfirmation =
            this.error.includes('confirmation');
          return throwError(err);
        }),
        tap(() => {
          this.form.reset();
          this.dialogRef.close();
          this.router.navigate([CONVERSATIONS_PATH]);
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
      password: value.newPassword,
      accepted: value.accepted,
      conversation_id: this.conversationId(),
    };

    if (value.organization) {
      body.org_id = value.organization.id;
    }

    this.authService
      .signUp(body as any)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.isLoading = false)),
        catchError((err: HttpErrorResponse) => {
          this.error = err.error.errors?.full_messages[0];
          return throwError(err);
        }),
        tap(() => {
          this.dialogRef.close();
          this.router.navigate([CONVERSATIONS_PATH]);
        }),
      )
      .subscribe();
  }

  public organizationSelected(value: string): void {
    this.form.get('organization').setValue(value);
  }

  private getAllOrganization(): void {
    if (this.isSignupMode) {
      this.organizationService
        .getOrganizationsList()
        .subscribe((organizations) => {
          this.organizations.set(organizations);
          this.organizationsInitValue.set(organizations);
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

  public cancelPasswordReset() {
    this.onSwitchMode('login');
  }
}
