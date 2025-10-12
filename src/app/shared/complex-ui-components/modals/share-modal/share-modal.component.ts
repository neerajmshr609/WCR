/* eslint-disable prettier/prettier */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonCloseComponent } from '@ui-kit/buttons/button-close/button-close.component';
import { NgoLogoIconComponent } from '@icons/ngo-logo-icon/ngo-logo-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { HorizontalLineComponent } from '@ui-kit/horizontal-line/horizontal-line.component';
import { ClickToCopyComponent } from '../../click-to-copy/click-to-copy.component';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonCloseComponent,
    NgoLogoIconComponent,
    TranslateModule,
    HorizontalLineComponent,
    ClickToCopyComponent,
  ],
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModalComponent {
  readonly shareTitle = input<string>();
  readonly shareLink = input.required<string>();
  constructor(private readonly _dialogRef: MatDialogRef<ShareModalComponent>) {}

  close() {
    this._dialogRef.close();
  }
}
