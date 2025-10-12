import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { InspiringFeedbacksRoutingModule } from './inspiring-feedbacks-routing.module';
import { InspiringFeedbacksComponent } from './layout/inspiring-feedbacks.component';

@NgModule({
  declarations: [InspiringFeedbacksComponent],
  imports: [SharedModule, InspiringFeedbacksRoutingModule],
})
export class InspiringFeedbacksModule {}
