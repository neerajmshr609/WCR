import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { CloseIconComponent } from '../../icons/close-icon/close-icon.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    LoginModalComponent,
    SignupModalComponent,
    CloseIconComponent,
    MatDialogClose,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent implements OnInit {
  public mode = signal<'login' | 'signup'>(null);
  public data = inject<{ mode: 'login' | 'signup'; conversationId: number }>(
    MAT_DIALOG_DATA,
  );
  private dialogRef = inject(MatDialogRef<AuthModalComponent>);

  public close(event) {
    if (event === 'login') {
      this.mode.set('login');
      return;
    }

    if (event === 'signup-success') {
      this.dialogRef.close(true);
      return;
    }

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.mode.set(this.data.mode);
  }
}
