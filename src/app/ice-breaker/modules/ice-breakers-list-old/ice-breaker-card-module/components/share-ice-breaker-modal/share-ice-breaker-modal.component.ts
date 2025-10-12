import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-ice-breaker-modal',
  templateUrl: './share-ice-breaker-modal.component.html',
  styleUrls: ['./share-ice-breaker-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareIceBreakerModalComponent {
  shareLink = '';
  title = '';
  userName = '';

  constructor(
    private dialogRef: MatDialogRef<ShareIceBreakerModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {
      shareLink: string;
      title: string;
      userName: string;
    },
  ) {
    this.shareLink = data.shareLink;
    this.title = data.title;
    this.userName = data.userName;
  }

  close(): void {
    this.dialogRef.close();
  }
}
