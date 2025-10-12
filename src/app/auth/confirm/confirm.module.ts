import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRoutingModule } from './confirm-routing.module';
import { ConfirmComponent } from './confirm.component';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [CommonModule, ConfirmRoutingModule],
})
export class ConfirmModule {}
