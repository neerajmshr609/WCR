import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsToolsRoutingModule } from './skills-tools-routing.module';
import { SkillsToolsComponent } from './layout/skills-tools/skills-tools.component';
import { AdvisorsModule } from '../../../advisors/advisors.module';
import { UsersettingsModule } from '../../../usersettings/usersettings.module';

@NgModule({
  declarations: [SkillsToolsComponent],
  imports: [
    CommonModule,
    SkillsToolsRoutingModule,
    AdvisorsModule,
    UsersettingsModule,
  ],
})
export class SkillsToolsModule {}
