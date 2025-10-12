import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { ArtfieldsComponent } from './artfields/artfields.component';
import { ParentcategoriesComponent } from './parentcategories/parentcategories.component';
import { CategoriesComponent } from './categories/categories.component';
import { RelationsComponent } from './relations/relations.component';
import { ArtCategoriesComponent } from './art-categories/art-categories.component';
import { SettingsComponent } from './settings/settings.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { StoryComponent } from './onboarding/story/story.component';
import { CardComponent } from './onboarding/card/card.component';
import { ProjectsComponent } from './projects/projects.component';
import { MatSortModule } from '@angular/material/sort';

import { MomentModule } from 'ngx-moment';
import { AdminRateflowComponent } from './projects/admin-rateflow/admin-rateflow.component';
import { NextworkComponent } from './nextwork/nextwork.component';
import { NextworkSettingsComponent } from './nextwork/nextwork-settings/nextwork-settings.component';
import { RelationsPerformanceComponent } from './nextwork/relations-performance/relations-performance.component';
import { MatTreeModule } from '@angular/material/tree';
import { ArtrelationsComponent } from './art-categories/artrelations/artrelations.component';
import { FeedbackSharedModule } from 'src/app/shared/feedback-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { OrgRequestsComponent } from './org-requests/org-requests.component';
import { OrgAccordionComponent } from './org-requests/org-accordion/org-accordion.component';
import { ButtonComponent } from 'src/app/shared/UIkit/button/button.component';
import { SectionHeaderComponent } from '../usersettings/components/section-header/section-header.component';
import { OrganizationService } from 'src/app/services/organization.service';

@NgModule({
  declarations: [
    AdminComponent,
    ArtfieldsComponent,
    ParentcategoriesComponent,
    CategoriesComponent,
    RelationsComponent,
    ArtCategoriesComponent,
    SettingsComponent,
    OnboardingComponent,
    StoryComponent,
    CardComponent,
    ProjectsComponent,
    AdminRateflowComponent,
    NextworkComponent,
    NextworkSettingsComponent,
    RelationsPerformanceComponent,
    ArtrelationsComponent,
    OrgRequestsComponent,
    OrgAccordionComponent,
  ],
  imports: [
    MatTreeModule,
    SharedModule,
    RouterModule,
    AdminRoutingModule,
    MatSliderModule,
    MatSidenavModule,
    MatTableModule,
    MomentModule,
    MatSortModule,
    FeedbackSharedModule,
    ButtonComponent,
    SectionHeaderComponent,
  ],
  providers: [OrganizationService],
  exports: [SettingsComponent],
})
export class AdminModule {}
