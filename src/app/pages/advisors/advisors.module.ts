import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvisorsRoutingModule } from './advisors-routing.module';
import { AdvisorCardComponent } from './advisor-card/advisor-card.component';
import { SkillCardListItemComponent } from './advisor-card/skill-card-list-item/skill-card-list-item.component';
import { SkillCardRequestComponent } from './advisor-card/skill-card-request/skill-card-request.component';
import { AdvisorsIntroCardComponent } from './advisors-intro-card/advisors-intro-card.component';
import { AdvisorsComponent } from './advisors.component';
import { HoursPipe } from './hours.pipe';
import { AdvisorScheduleComponent } from './advisor-schedule/advisor-schedule.component';
import { AdvisorsServicesModule } from './services/advisors-services.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelfContactErrorModalComponent } from './self-contact-error-modal/self-contact-error-modal.component';
import { SelectedWithoutSkillErrorModalComponent } from './selected-without-skill-error-modal/selected-without-skill-error-modal.component';
import { SkillSelectModuleModule } from '../upload/my-skills-select/skill-select-module.module';
import { AvailableTimeSlotsComponent } from './advisor-card/available-time-slots/available-time-slots.component';
import { UsersettingsModule } from '../usersettings/usersettings.module';
import { EmptyPlaceholderImagePipe } from './advisor-card/pipes/empty-placeholder-image.pipe';
import { ShareProfileModalModule } from '../../shared/components/share-profile-modal/share-profile-modal.module';
import { CanPickTimePipe } from './advisor-card/pipes/can-pick-time.pipe';
import { TotalScoreModule } from './advisor-card/total-score/total-score.module';
import { SelectSkillContainerModule } from '../../shared/components/select-skill-container/select-skill-container.module';

@NgModule({
  declarations: [
    AdvisorsComponent,
    AdvisorCardComponent,
    SkillCardListItemComponent,
    SkillCardRequestComponent,
    AdvisorsIntroCardComponent,
    HoursPipe,
    AdvisorScheduleComponent,
    SelfContactErrorModalComponent,
    SelectedWithoutSkillErrorModalComponent,
    AvailableTimeSlotsComponent,
    EmptyPlaceholderImagePipe,
    CanPickTimePipe,
  ],
  exports: [AdvisorCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    ShareProfileModalModule,
    AdvisorsRoutingModule,
    AdvisorsServicesModule,
    SkillSelectModuleModule,
    UsersettingsModule,
    TotalScoreModule,
    SelectSkillContainerModule,
  ],
})
export class AdvisorsModule {}
