import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSkillPipe } from './user-skill.pipe';

@NgModule({
  declarations: [UserSkillPipe],
  imports: [CommonModule],
  exports: [UserSkillPipe],
})
export class UserSkillModule {}
