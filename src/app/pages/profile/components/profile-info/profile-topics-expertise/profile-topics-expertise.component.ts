import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  SETTINGS_MODULE_PATH,
  SKILLS_SETTINGS_PAGE_QUERY_PARAM,
} from '../../../../usersettings/routing/paths';
import { UserProfileSkillsService } from '../../../services/user-profile-skills.service';

@Component({
  selector: 'app-profile-topics-expertise',
  templateUrl: './profile-topics-expertise.component.html',
  styleUrls: ['./profile-topics-expertise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTopicsExpertiseComponent {
  readonly profile = toSignal(this._profileService.publicProfile$);
  readonly isProfileOwner = toSignal(this._profileService.isProfileOwner$);
  readonly skills = toSignal(this.skillsService.userProfileSkillsList$);
  readonly selectedSkill = toSignal(this.skillsService.selectedSkill$);

  constructor(
    private readonly _profileService: ProfileService,
    readonly skillsService: UserProfileSkillsService,
    private readonly _router: Router,
  ) {}

  editClickHandler() {
    this._router.navigate([SETTINGS_MODULE_PATH], {
      queryParams: SKILLS_SETTINGS_PAGE_QUERY_PARAM,
    });
  }
}
