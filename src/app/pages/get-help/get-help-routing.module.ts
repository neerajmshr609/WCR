import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetHelpComponent } from './get-help.component';

const routes: Routes = [
  {
    path: '',
    component: GetHelpComponent,
  },
];

export const GET_HELP_PATH = 'help';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetHelpRoutingModule {}
