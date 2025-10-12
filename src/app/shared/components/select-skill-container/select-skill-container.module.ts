import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectSkillContainerComponent } from './select-skill-container.component';
import { SmallSpinnerModule } from '../small-spinner/small-spinner.module';
import { SkillSelectModuleModule } from '../../../pages/upload/my-skills-select/skill-select-module.module';

@NgModule({
  declarations: [SelectSkillContainerComponent],
  exports: [SelectSkillContainerComponent],
  imports: [CommonModule, SmallSpinnerModule, SkillSelectModuleModule],
})
export class SelectSkillContainerModule {}
