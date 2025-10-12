import {
  ChangeDetectorRef,
  Component,
  input,
  output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FORMS } from '../../constants/forms';
import { User } from 'src/app/shared/models/user.model';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { catchError, debounceTime, of, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UsersService } from 'src/app/services/users.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss'],
})
export class AccountInformationComponent
  extends BaseComponent
  implements OnChanges
{
  currentUser = input<User>();
  onSave = output<Partial<User>>({});

  languages = new UntypedFormControl();

  form: UntypedFormGroup;
  formData = FORMS['client'];
  savingSub: Subscription;
  isMobile: boolean = window.innerWidth < 769;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private uploaderService: UploaderService,
    private userService: UsersService,
    private dialog: MatDialog,
  ) {
    super();

    this.uploaderService.uploaderConfig = {
      id: 'uploader--user-avatar',
      target: 'uploader--user-avatar',
      inline: false,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUser']?.currentValue) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (!this.currentUser) return;

    this.languages.setValue(this.currentUser()?.lang?.split(','));

    this.form = new UntypedFormGroup({
      first_name: new UntypedFormControl(this.currentUser().first_name),
      last_name: new UntypedFormControl(this.currentUser().last_name),
      name: new UntypedFormControl(this.currentUser().username),
      city: new UntypedFormControl(this.currentUser()?.city),
      phone_number: new UntypedFormControl(this.currentUser().phone_number),
      country: new UntypedFormControl(this.currentUser()?.country),
      email: new UntypedFormControl(this.currentUser().email, [
        Validators.required,
        Validators.email,
      ]),
      postal_code: new UntypedFormControl(this.currentUser()?.postal_code),
    });

    this.subscribeToForm();
  }

  private subscribeToForm(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      if (control) {
        control.valueChanges.pipe(debounceTime(2000)).subscribe(async (res) => {
          if (!this.form.invalid) {
            this.onSave.emit({ [controlName]: res });
          }
        });
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  handleEmailChange(): void {
    if (!this.form.invalid) {
      //incomplete
      this.onSave.emit({ email: this.currentUser().email });
    }
  }

  selectAvatar(url: string): void {
    if (!this.form.invalid) {
      this.onSave.emit({ image: url });
    }
  }

  openUploader(avatar: string): void {
    if (!this.form.invalid) {
      this.onSave.emit({ image: avatar });
    }
  }

  resetPasword(): void {
    this.authService
      .resetPassword(this.currentUser().email)
      .subscribe((res: { message: string }) => {
        this.snackBar.open(res.message, null, {
          duration: 1500,
        });
      });
  }

  changeLanguage(ev: string[]): void {
    if (!this.form.invalid) {
      this.onSave.emit({ lang: ev.join() });
    }
  }

  // deletePersonalInfo(): void {
  //   const dialogRef = this.dialog.open(ConfirmModalComponent, {
  //     maxWidth: this.isMobile ? '320px' : '450px',
  //     width: '100%',
  //     data: {
  //       title: 'personal_info_removing.title',
  //       subtitle: 'personal_info_removing.subtitle',
  //       question: 'personal_info_removing.question',
  //       cancel_btn: 'personal_info_removing.cancel_btn',
  //       confirm_btn: 'personal_info_removing.confirm_btn',
  //     },
  //   });

  //   dialogRef
  //     .afterClosed()
  //     .pipe(
  //       catchError(() => {
  //         //incomplete
  //         return of({});
  //       }),
  //     )
  //     .subscribe(() => {
  //       this.userService
  //         .deleteUserPersonalInfo(this.currentUser().id)
  //         .subscribe((res: { message: string }) => {
  //           this.snackBar.open(res.message, null, {
  //             duration: 1500,
  //           });
  //         });
  //     });
  //   return;
  // }
}
