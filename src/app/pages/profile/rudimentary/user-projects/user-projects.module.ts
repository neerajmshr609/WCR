import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserProjectsRoutingModule } from './user-projects-routing.module';
import { UserProjectsComponent } from './layout/user-projects.component';

@NgModule({
  declarations: [UserProjectsComponent],
  imports: [SharedModule, UserProjectsRoutingModule],
})
export class UserProjectsModule {}
