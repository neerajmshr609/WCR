import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../UIkit/button/button.component';
import { CloseIconComponent } from '../../icons/close-icon/close-icon.component';

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ButtonComponent,
    CloseIconComponent,
  ],
})
export class ConfirmModalModule {}
