import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { MyProjectsComponent } from './my-projects.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MyProjectsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProjectsRoutingModule {}
