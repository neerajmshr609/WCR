import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspiringFeedbacksComponent } from './layout/inspiring-feedbacks.component';

const routes: Routes = [{ path: '', component: InspiringFeedbacksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspiringFeedbacksRoutingModule {}
