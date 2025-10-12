import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { CloseIconComponent } from '@icons/close-icon/close-icon.component';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-create-capsule-modal',
  templateUrl: './create-capsule-modal.component.html',
  styleUrls: ['./create-capsule-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ButtonComponent,
    TranslateModule,
    CloseIconComponent,
  ],
})
export class CreateCapsuleModalComponent {
  readonly dialogRef = inject(MatDialogRef<CreateCapsuleModalComponent>);
  readonly data = inject<{ user: User; skill: string }>(MAT_DIALOG_DATA);
  readonly helpLink = `${origin}/help`;
  readonly userLink = `${origin}/profile/${this.data.user.sharetoken}/ice-breakers`;
  readonly ngoLink = this.data.user.organization
    ? `${origin}/org/${this.data.user.organization?.short_name}`
    : null;

  public close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
