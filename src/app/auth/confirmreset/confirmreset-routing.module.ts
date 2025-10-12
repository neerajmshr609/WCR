import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmresetComponent } from './confirmreset.component';

const routes: Routes = [
  {
    path: '',
    component: ConfirmresetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmresetRoutingModule {}
