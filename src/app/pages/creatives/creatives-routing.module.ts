import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreativesComponent } from './layout/creatives.component';

const routes: Routes = [
  {
    path: '',
    component: CreativesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativesRoutingModule {}
