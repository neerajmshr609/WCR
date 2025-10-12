import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ButtonComponent } from '../../../shared/UIkit/button/button.component';
import { CloseIconComponent } from '../../../shared/icons/close-icon/close-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-please-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CloseIconComponent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './please-login-modal.component.html',
  styleUrls: ['./please-login-modal.component.scss'],
})
export class PleaseLoginModalComponent {
  private dialogRef = inject(MatDialogRef<PleaseLoginModalComponent>);

  public close(): void {
    this.dialogRef.close(false);
  }

  public goLogin(): void {
    this.dialogRef.close(true);
  }
}
