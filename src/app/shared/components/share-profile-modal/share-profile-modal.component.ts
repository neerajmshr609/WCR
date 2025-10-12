import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { getUserSeoData } from '../../functions/get-user-seo-data';
import { Clipboard } from '@angular/cdk/clipboard';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-share-profile-modal',
  templateUrl: './share-profile-modal.component.html',
  styleUrls: ['./share-profile-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareProfileModalComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  title = '';
  description = '';
  link = '';
  imgSrc: string;

  constructor(
    private dialogRef: MatDialogRef<ShareProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly user: User,
    private clipboard: Clipboard,
  ) {
    super();
  }

  ngOnInit(): void {
    const { title, description, image, url } = getUserSeoData(this.user);
    this.title = title;
    this.description = description;
    this.link = url + '/ice-breakers';
    this.imgSrc = image;
  }

  copyLink(): void {
    this.clipboard.copy(this.link);
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
