import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { RateflowComponent } from './rateflow.component';

const routes: Routes = [
  {
    path: '',
    component: RateflowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: RateflowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RateflowRoutingModule {}
