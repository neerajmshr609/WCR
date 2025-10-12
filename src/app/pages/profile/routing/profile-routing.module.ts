import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../components/_profile/profile.component';
import {
  ASK_A_QUESTION_CHILD_PATH,
  CAPSULE_CHILD_PATH,
  ORGANIZATIONS_CHILD_PATH,
  WEBLINKS_CHILD_PATH,
} from './profile.paths';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: WEBLINKS_CHILD_PATH.routerPath,
        loadChildren: () =>
          import('../rudimentary/weblinks/weblinks.module').then(
            (m) => m.WeblinksModule,
          ),
      },
      {
        path: ASK_A_QUESTION_CHILD_PATH.routerPath,
        loadComponent: () =>
          import(
            '../components/_child/ask-a-question/ask-a-question.component'
          ).then((m) => m.AskAQuestionComponent),
      },
      {
        path: CAPSULE_CHILD_PATH.routerPath,
        loadComponent: () =>
          import(
            '../components/_child/ice-breakers-list/profile-icebreakers-list.component'
          ).then((m) => m.ProfileIcebreakersListComponent),
      },
      {
        path: CAPSULE_CHILD_PATH.toRelativeUrl(),
        loadComponent: () =>
          import(
            '../components/_child/ice-breakers-list/profile-icebreakers-list.component'
          ).then((m) => m.ProfileIcebreakersListComponent),
      },
      {
        path: ORGANIZATIONS_CHILD_PATH.routerPath,
        loadComponent: () =>
          import(
            '../components/_child/organizations/organizations.component'
          ).then((m) => m.OrganizationsComponent),
      },
      {
        path: '**',
        redirectTo: CAPSULE_CHILD_PATH.toRelativeUrl(),
      },
    ],
    // children: [
    // { path: '', pathMatch: 'full', redirectTo: 'ice-breakers' },
    // {
    //   path: 'skills-tools',
    //   loadChildren: () => import('./skills-tools/skills-tools.module').then(m => m.SkillsToolsModule)
    // },
    // {
    //   path: ICE_BREAKER_PATH,
    //   loadChildren: () =>
    //     import('./ice-breakers/ice-breakers.module').then(
    //       (m) => m.IceBreakersModule,
    //     ),
    // },
    // ],
    // {
    //   path: `${CREATE_ICE_BREAKER_PATH}/:userSkillId`,
    //   loadChildren: () =>
    //     import('./ice-breaker-template/ice-breaker-template.module').then(
    //       (m) => m.IceBreakerTemplateModule,
    //     ),
    // },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
