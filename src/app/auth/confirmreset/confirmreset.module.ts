import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmresetRoutingModule } from './confirmreset-routing.module';
import { ConfirmresetComponent } from './confirmreset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfirmresetComponent],
  imports: [
    CommonModule,
    ConfirmresetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ConfirmresetModule {}
