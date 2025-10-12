import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inform-modal',
  templateUrl: './inform-modal.component.html',
  styleUrls: ['./inform-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformModalComponent {
  imgSrc: string;
  headerText: string;
  footerText: string;

  constructor(
    private dialogRef: MatDialogRef<InformModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {
      imgSrc: string;
      headerText: string;
      footerText: string;
    },
  ) {
    this.imgSrc = data.imgSrc;
    this.headerText = data.headerText;
    this.footerText = data.footerText;
  }

  close(): void {
    this.dialogRef.close();
  }
}
