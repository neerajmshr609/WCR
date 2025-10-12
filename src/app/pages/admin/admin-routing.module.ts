import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ArtCategoriesComponent } from './art-categories/art-categories.component';
import { SettingsComponent } from './settings/settings.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { ProjectsComponent } from './projects/projects.component';
import { NextworkComponent } from './nextwork/nextwork.component';
import { NextworkSettingsComponent } from './nextwork/nextwork-settings/nextwork-settings.component';
import { RelationsPerformanceComponent } from './nextwork/relations-performance/relations-performance.component';
import { ArtrelationsComponent } from './art-categories/artrelations/artrelations.component';
import { OrgRequestsComponent } from './org-requests/org-requests.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'artcategories',
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'skills',
        loadChildren: () =>
          import('./skills/skills.module').then((m) => m.SkillsModule),
      },
      {
        path: 'payouts',
        loadChildren: () =>
          import('./payouts/payouts.module').then((m) => m.PayoutsModule),
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
      },
      {
        path: 'nextwork',
        component: NextworkComponent,
        children: [
          {
            path: 'nextwork-settings',
            component: NextworkSettingsComponent,
          },
          {
            path: 'relations',
            component: RelationsPerformanceComponent,
          },
        ],
      },
      {
        path: 'artcategories',
        component: ArtCategoriesComponent,
        children: [
          {
            path: ':id',
            component: ArtrelationsComponent,
          },
        ],
      },
      {
        path: 'tags-order',
        loadChildren: () =>
          import('./tags-order/tags-order.module').then(
            (m) => m.TagsOrderModule,
          ),
      },
      {
        path: 'orgRequests',
        component: OrgRequestsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
