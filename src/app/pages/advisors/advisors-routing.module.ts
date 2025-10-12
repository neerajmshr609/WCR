import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorsComponent } from './advisors.component';

const routes: Routes = [
  {
    path: '',
    component: AdvisorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvisorsRoutingModule {}
