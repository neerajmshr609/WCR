import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CloseIconComponent } from '@icons/close-icon/close-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '@ui-kit/input/input.component';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { FooterService } from '../../../services/footer/footer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { passwordComplexityValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    CloseIconComponent,
    TranslateModule,
    InputComponent,
    MatDialogActions,
    ButtonComponent,
  ],
})
export class ConfirmModalComponent implements OnInit {
  form = new FormGroup(
    {
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        passwordComplexityValidator(),
      ]),
      passwordConfirmation: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    {
      validators: MustMatch('password', 'passwordConfirmation'),
    },
  );
  successMessage: string;
  isLoading = false;
  private resetToken = signal<string>(null);
  private dialogRef = inject(MatDialogRef<ConfirmModalComponent>);

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private footerService: FooterService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.footerService.hideFooter();

    const params = this.activatedRoute.snapshot.queryParams;
    if (params.reset_password_token) {
      this.resetToken.set(params.reset_password_token);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (!this.resetToken()) {
      return;
    }
    const password = this.form.value.password;

    this.authService
      .resetConfirmPassword(password, this.resetToken())
      .subscribe(() => {
        this.snackBar.open('Your password was changed successfully', null, {
          duration: 3000,
        });
        this.dialogRef.close();
      });
  }
}
