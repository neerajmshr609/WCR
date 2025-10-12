import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IceBreakerTemplateComponent } from './pages/ice-breaker-template/ice-breaker-template.component';

const routes: Routes = [
  {
    path: '',
    component: IceBreakerTemplateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IceBreakerTemplateRoutingModule {}
