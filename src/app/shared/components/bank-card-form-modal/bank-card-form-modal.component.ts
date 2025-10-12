import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bank-card-form-modal',
  templateUrl: './bank-card-form-modal.component.html',
  styleUrls: ['./bank-card-form-modal.component.scss'],
})
export class BankCardFormModalComponent {
  constructor(
    public dialogRef: MatDialogRef<BankCardFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public secret: string,
  ) {}

  paid(): void {
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
