import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IConfirmationMessage } from './confirmation-message.interface';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { XIconComponent } from '../../icons/x-icon/x-icon.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonCloseComponent } from '../../UIkit/buttons/button-close/button-close.component';

@Component({
  selector: 'app-confirmation-message',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    XIconComponent,
    TranslateModule,
    ButtonCloseComponent,
  ],
  templateUrl: './confirmation-message.component.html',
  styleUrls: ['./confirmation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationMessageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IConfirmationMessage,
    private readonly _dialogRef: MatDialogRef<ConfirmationMessageComponent>,
  ) {
  }

  close() {
    this._dialogRef.close(false);
  }

  cancel() {
    this._dialogRef.close(false);
  }

  confirm(): void {
    this._dialogRef.close(true);
  }

  isTypeOfMessageString() {
    return typeof this.data.message === 'string';
  }

  isConfirmationButtonText() {
    return typeof this.data.confirm === 'string';
  }
}
