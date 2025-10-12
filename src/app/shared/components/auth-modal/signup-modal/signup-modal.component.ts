import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteModule } from '../../../UIkit/autocomplete/autocomplete.module';
import { ButtonComponent } from '../../../UIkit/button/button.component';
import { CoreModule } from '../../../modules/core.module';
import { InputComponent } from '../../../UIkit/input/input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SearchIconComponent } from '../../../icons/search-icon/search-icon.component';
import { SmallSpinnerModule } from '../../small-spinner/small-spinner.module';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationService } from '../../../../services/organization.service';
import { OrganizationShort } from '../../../models/organizationShort';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewUserIconComponent } from '../../../icons/new-user-icon/new-user-icon.component';
import { SignupDTO } from '../../../../auth/model/sign-up-dto.interface';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { IconNewUserComponent } from '@icons/icon-new-user/icon-new-user.component';
import { IconDoubleRightArrowComponent } from '@icons/icon-double-right-arrow/icon-double-right-arrow.component';
import { LoginIconComponent } from '@icons/login-icon/login-icon.component';
import { UserIconComponent } from '@icons/user-icon/user-icon.component';
import { SIGNUP_MODE } from '../../../../auth/auth.component';

const rippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0,
  },
};

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [
    CommonModule,
    AutocompleteModule,
    ButtonComponent,
    CoreModule,
    InputComponent,
    MatCheckbox,
    ReactiveFormsModule,
    SearchIconComponent,
    SmallSpinnerModule,
    TranslateModule,
    NewUserIconComponent,
    IconNewUserComponent,
    IconDoubleRightArrowComponent,
    LoginIconComponent,
    UserIconComponent,
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: rippleConfig },
    OrganizationService,
  ],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupModalComponent implements OnInit {
  public isEnterCompanyName = signal(false);
  public signUpMode = signal<SIGNUP_MODE>('client');
  public conversationId = input<number>();
  public form = new UntypedFormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9_]*$/),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    organization: new FormControl(null, []),
    accepted: new FormControl(false, [
      Validators.required,
      Validators.requiredTrue,
    ]),
  });

  public error = signal<string>(null);
  public shouldShowResendConfirmation = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  public closeModal = output<void | string>();
  public organizationsControl = new FormControl(null, []);
  public organizations = signal<OrganizationShort[]>([]);

  public organizationsInitValue = signal<OrganizationShort[]>([]);
  public termsLink = `${environment.baseUrl}terms`;

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getAllOrganization();
    this.filteringOrganization();
  }

  public onSubmit(): void {
    this.signup();
  }

  private signup(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const body: SignupDTO = {
      email: value.email,
      username: value.username,
      password: value.password,
      accepted: value.accepted,
      conversation_id: this.conversationId(),
    };
    if (value.organization) {
      body.org_id = value.organization.id;
    }
    if (this.signUpMode() === 'counsellor' && value.organization_name) {
      body.organization_name = value.organization_name;
    }
    this.authService
      .signUp(body)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.error.errors?.full_messages[0]);
          return throwError(err);
        }),
      )
      .subscribe(() => {
        this.form.reset();
        this.closeModal.emit('signup-success');
      });
  }

  public organizationSelected(value: string): void {
    this.form.get('organization').setValue(value);
  }

  private getAllOrganization(): void {
    this.organizationService
      .getOrganizationsList()
      .subscribe((organizations) => {
        this.organizations.set(organizations);
        this.organizationsInitValue.set(organizations);
      });
  }

  public didRequestConfirmation(email: string) {
    this.authService
      .requestConfirmationEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.error.set('Confirmation email sent to ' + email);
      });
  }

  public setCounsellorSignUp(): void {
    this.signUpMode.set('counsellor');
  }

  public setClientSignUp(): void {
    this.signUpMode.set('client');
  }

  private filteringOrganization(): void {
    this.organizationsControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((find) => {
        const organizations = this.organizationsInitValue();
        this.organizations.set(
          organizations.filter((org) =>
            org.legal_name.toLowerCase().includes(find.toLowerCase()),
          ),
        );
      });
  }

  public goLogin(): void {
    this.closeModal.emit('login');
  }

  public switchCompanySelect(dropdown): void {
    this.isEnterCompanyName.set(true);
    this.form.addControl('organization_name', new UntypedFormControl(null));
    this.form.removeControl('organization');
    if (dropdown) {
      dropdown.close();
    }
  }
}
