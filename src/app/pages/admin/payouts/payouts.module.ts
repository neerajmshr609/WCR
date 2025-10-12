import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayoutsRoutingModule } from './payouts-routing.module';
import { PayoutsComponent } from './payouts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { PayoutModalComponent } from './payout-modal/payout-modal.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [PayoutsComponent, PayoutModalComponent],
  imports: [
    CommonModule,
    PayoutsRoutingModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
  ],
})
export class PayoutsModule {}
