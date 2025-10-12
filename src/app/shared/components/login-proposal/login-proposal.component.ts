import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoginIconComponent } from '../../icons/login-icon/login-icon.component';
import { IconSignUpComponent } from '../../icons/icon-sign-up/icon-sign-up.component';
import { IconInfoComponent } from '../../icons/icon-info/icon-info.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { SuccessSignUpModalComponent } from '../auth-modal/success-sign-up-modal/success-sign-up-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-proposal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule,
    LoginIconComponent,
    IconSignUpComponent,
    IconInfoComponent,
  ],
  templateUrl: './login-proposal.component.html',
  styleUrls: ['./login-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginProposalComponent {
  public title = input<string>();
  public conversationId = input<number>();
  private destroyRef = inject(DestroyRef);

  constructor(private dialog: MatDialog) {}

  public login() {
    this.dialog.open(AuthModalComponent, {
      autoFocus: false,
      width: '100%',
      maxWidth: '551px',
      maxHeight: '90vh',
      panelClass: 'auth-modal',
      data: {
        mode: 'login',
        conversationId: this.conversationId(),
      },
    });
  }

  public signup() {
    const modal = this.dialog.open(AuthModalComponent, {
      autoFocus: false,
      width: '100%',
      maxWidth: '551px',
      maxHeight: '90vh',
      panelClass: 'auth-modal',
      data: {
        mode: 'signup',
        conversationId: this.conversationId(),
      },
    });
    modal
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res) {
          this.dialog.open(SuccessSignUpModalComponent, {
            autoFocus: false,
            width: '100%',
            maxWidth: '551px',
            maxHeight: '90vh',
            panelClass: 'auth-modal',
          });
        }
      });
  }
}
