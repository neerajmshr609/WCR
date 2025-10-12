import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { AddFundsComponent } from './add-funds/add-funds.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectEditComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        keywords: 'Upload New Project',
        title: 'Upload New Project',
        description: 'Upload new project',
      },
    },
  },
  {
    path: ':id',
    component: ProjectEditComponent,
  },
  {
    path: 'balance',
    component: AddFundsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule {}
