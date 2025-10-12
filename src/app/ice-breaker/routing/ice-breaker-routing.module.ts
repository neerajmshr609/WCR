import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { counselorGuard } from '../../shared/guards/counselor.guard';
import { ICE_BREAKER_CREATE_PATH } from './ice-breaker.paths';

const routes: Routes = [
  {
    path: '',
    canActivate: [counselorGuard],
    children: [
      {
        path: ICE_BREAKER_CREATE_PATH.routerPath,
        loadChildren: () =>
          import(
            '../modules/ice-breaker-template/ice-breaker-template.module'
          ).then((m) => m.IceBreakerTemplateModule),
      },
      {
        path: ICE_BREAKER_CREATE_PATH.toRelativeUrl(),
        loadChildren: () =>
          import(
            '../modules/select-icebreaker-skill/select-icebreaker-skill.module'
          ).then((m) => m.SelectIcebreakerSkillModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IceBreakerRoutingModule {}
