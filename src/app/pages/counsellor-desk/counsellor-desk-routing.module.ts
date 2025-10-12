import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounsellorDeskComponent } from './counsellor-desk/counsellor-desk.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

export const COUNSELLOR_DESK_PATH = 'counsellor-desk';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: CounsellorDeskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounsellorDeskRoutingModule {}
