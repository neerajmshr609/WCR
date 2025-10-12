import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkillItemComponent } from './components/skill-item/skill-item.component';
import { TagsComponent } from './components/tags/tags.component';
import { SkillsComponent } from './layout/skills.component';
import { SkillsRoutingModule } from './skills-routing.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [SkillsComponent, SkillItemComponent, TagsComponent],
  imports: [SharedModule, SkillsRoutingModule, NgOptimizedImage],
})
export class SkillsModule {}
