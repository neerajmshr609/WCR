import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MailIconComponent } from '@icons/mail-icon/mail-icon.component';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { IconDoubleRightArrowComponent } from '@icons/icon-double-right-arrow/icon-double-right-arrow.component';
import { UserIconComponent } from '@icons/user-icon/user-icon.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CloseIconComponent } from '@icons/close-icon/close-icon.component';
import { AuthService } from '../auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-check-email-modal',
  templateUrl: './check-email-modal.component.html',
  styleUrls: ['./check-email-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MailIconComponent,
    ButtonComponent,
    IconDoubleRightArrowComponent,
    UserIconComponent,
    CloseIconComponent,
    TranslateModule,
  ],
})
export class CheckEmailModalComponent implements OnInit {
  public email = signal<string>(null);
  private dialogRef = inject(MatDialogRef<CheckEmailModalComponent>);
  readonly data = inject<{ email: string }>(MAT_DIALOG_DATA);

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.email.set(this.data.email);
  }

  public resend(): void {
    this.authService.resendMagicLink(this.email()).subscribe((res) => {
      this.snackBar.open('Link was resent', null, {
        duration: 3000,
      });
    });
  }

  public goLogin(): void {
    this.authService.openLoginForm();
    this.close();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
