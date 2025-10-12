import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { CloseIconComponent } from '../../../../shared/icons/close-icon/close-icon.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharingAdviceAs } from '../../../../shared/models/UserSkill.model';
import { MarkIconComponent } from '../../../../shared/icons/mark-icon/mark-icon.component';

@Component({
  selector: 'app-sharing-advice-guide-modal',
  templateUrl: './sharing-advice-guide-modal.component.html',
  styleUrls: ['./sharing-advice-guide-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    CloseIconComponent,
    MatDialogActions,
    MatDialogContent,
    TranslateModule,
    MatDialogTitle,
    MarkIconComponent,
  ],
})
export class SharingAdviceGuideModalComponent {
  public data: { type: SharingAdviceAs } = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SharingAdviceGuideModalComponent>);

  allow() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }
}
