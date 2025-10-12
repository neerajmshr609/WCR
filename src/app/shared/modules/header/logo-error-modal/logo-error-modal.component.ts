import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-info',
  templateUrl: './logo-error-modal.component.html',
  styleUrls: ['./logo-error-modal.component.scss'],
})
export class LogoErrorModalComponent {
  constructor(private dialogRef: MatDialogRef<LogoErrorModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
