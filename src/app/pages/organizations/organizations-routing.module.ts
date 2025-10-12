import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationProfileComponent } from './organization-profile/organization-profile.component';

const routes: Routes = [
  {
    path: ':organizationName',
    component: OrganizationProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsRoutingModule {}
