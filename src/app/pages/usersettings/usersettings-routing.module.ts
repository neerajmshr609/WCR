import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersettingsComponent } from './usersettings.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UsersettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersettingsRoutingModule {}
