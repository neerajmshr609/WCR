import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-become-advisor-modal',
  templateUrl: './become-advisor-modal.component.html',
  styleUrls: ['./become-advisor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAdvisorModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<BecomeAdvisorModalComponent>,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
