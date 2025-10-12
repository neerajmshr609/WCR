import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../../services/profile.service';
import { IceBreakersListCardComponent } from './ice-breakers-list-card/ice-breakers-list-card.component';
import { UserProfileSkillsService } from '../../../services/user-profile-skills.service';
import { UserProfileIceBreaker } from '../../../model/user-profile-ice-breaker.model';
import { castToArray } from '@helpers-lib/array-helpers.lib';
import { Router } from '@angular/router';
import { MoreIcebreakerComponent } from './more-icebreaker/more-icebreaker.component';

@Component({
  selector: 'app-profile-icebreakers-list',
  standalone: true,
  imports: [
    CommonModule,
    IceBreakersListCardComponent,
    MoreIcebreakerComponent,
  ],
  templateUrl: './profile-icebreakers-list.component.html',
  styleUrls: ['./profile-icebreakers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileIcebreakersListComponent {
  readonly userProfile = toSignal(this._profileService.publicProfile$);
  private readonly _userProfileSkills = toSignal(
    this._userProfileSkillService.userProfileSkills$,
  );
  readonly selectedUserProfileSkill = toSignal(
    this._userProfileSkillService.selectedUserSkill$,
  );
  readonly isProfileOwner = toSignal(this._profileService.isProfileOwner$);
  private readonly _userIceBreakersList = toSignal(
    this._profileService.publicProfileIceBreakers$,
  );
  readonly filteredIceBreakers = computed(() => {
    const selectedSkill = this.selectedUserProfileSkill();
    const icebreakersList = this._userIceBreakersList();
    return selectedSkill
      ? icebreakersList.filter((_) => _.belongsTo(selectedSkill))
      : icebreakersList;
  });
  readonly capsuleId = input<string>(null);
  private readonly _parsedCapsuleId = computed(() => {
    let parsed: number | null = null;
    const capsuleId = this.capsuleId();
    if (capsuleId) {
      parsed = parseInt(capsuleId, 10);
      if (Number.isNaN(parsed) || parsed.toString() !== capsuleId) {
        parsed = null;
      }
    }
    return parsed;
  });

  readonly displayIceBreakers = computed(() => {
    const parsedCapsuleId = this._parsedCapsuleId();
    const iceBreakers = this.filteredIceBreakers();
    const icebreakerById =
      Number.isInteger(parsedCapsuleId) &&
      iceBreakers.find((_) => _.id === parsedCapsuleId);
    return icebreakerById ? [icebreakerById] : iceBreakers;
  });

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _userProfileSkillService: UserProfileSkillsService,
    private readonly _router: Router,
  ) {
    effect(() => this._removeCapsuleIdFromUrl());
  }

  getIceBreakerSkill(iceBreaker: UserProfileIceBreaker) {
    const iceBreakerSkillId = iceBreaker.user_skill_id;
    return this._userProfileSkills().find(
      (userSkill) => userSkill.id === iceBreakerSkillId,
    );
  }

  scrollToIceBreaker(iceBreakerCard: UserProfileIceBreaker) {
    const capsuleId = this._parsedCapsuleId();
    return Number.isInteger(capsuleId) && capsuleId === iceBreakerCard.id;
  }

  private _removeCapsuleIdFromUrl() {
    const parsedCapsuleId = this._parsedCapsuleId();

    if (
      !Number.isInteger(parsedCapsuleId) ||
      !this.selectedUserProfileSkill()
    ) {
      return;
    }

    const url = this._router.url;
    const urlWithoutId = url.replace(`/${parsedCapsuleId}`, '');

    this._router.navigate([urlWithoutId]);
  }
}
