import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectIcebreakerSkillComponent } from '../components/select-icebreaker-skill/select-icebreaker-skill.component';
const routes: Routes = [
  {
    path: '',
    component: SelectIcebreakerSkillComponent,
    data: {
      pathTitle: 'create_capsule',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectIcebreakerSkillRoutingModule {}
