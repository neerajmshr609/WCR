import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../UIkit/button/button.component';
import { CloseIconComponent } from '../../../icons/close-icon/close-icon.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { EscalationValue } from '../escalation-modal.component';
import { IconCheckCircleComponent } from '../../../icons/icon-check-circle/icon-check-circle.component';

@Component({
  selector: 'app-success-escalation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CloseIconComponent,
    MatDialogActions,
    TranslateModule,
    MatDialogContent,
    MatDialogTitle,
    IconCheckCircleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './success-escalation.component.html',
  styleUrls: ['./success-escalation.component.scss'],
})
export class SuccessEscalationComponent {
  readonly data = inject<{ escalationLevel: EscalationValue }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SuccessEscalationComponent>);

  public close(): void {
    this.dialogRef.close();
  }
}
