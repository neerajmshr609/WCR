import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InsightsComponent } from './insights.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: ':id',
    component: InsightsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsightsRoutingModule {}
