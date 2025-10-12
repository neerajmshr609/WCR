import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsToolsComponent } from './layout/skills-tools/skills-tools.component';

const routes: Routes = [
  {
    path: '',
    component: SkillsToolsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillsToolsRoutingModule {}
