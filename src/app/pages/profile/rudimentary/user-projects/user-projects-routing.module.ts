import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProjectsComponent } from './layout/user-projects.component';

const routes: Routes = [{ path: '', component: UserProjectsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProjectsRoutingModule {}
