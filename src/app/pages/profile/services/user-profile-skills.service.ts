import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  castToArray,
  isArrayAndHasItems,
} from '@helpers-lib/array-helpers.lib';
import { Skill } from '../../../services/skill/model/skill.model';
import { AdvisorProfileUserSkill } from '../model/advisor-profile-user-skill.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileSkillsService {
  readonly userProfileSkills$ = this._profileService.publicProfile$.pipe(
    map((_) => castToArray<AdvisorProfileUserSkill>(_.user_skills)),
  );
  readonly userProfileSkillsList$ = this.userProfileSkills$.pipe(
    map((_) => _.map((userSkill) => userSkill.skill)),
  );
  private readonly _selectedSkill$ = new BehaviorSubject<Skill | null>(null);
  readonly selectedUserSkill$ = combineLatest([
    this.userProfileSkills$,
    this._selectedSkill$.asObservable(),
  ]).pipe(
    map(
      ([userSkills, selectedSkill]) =>
        (isArrayAndHasItems(userSkills) &&
          selectedSkill &&
          userSkills.find((_) => _.skill.isEqualTo(selectedSkill))) ||
        null,
    ),
  );

  readonly selectedSkill$ = this.selectedUserSkill$.pipe(
    map((_) => _?.skill || null),
  );

  constructor(private readonly _profileService: ProfileService) {}

  selectSkill(skill: Skill) {
    this._selectedSkill$.next(skill);
  }

  clearSelectedSkill() {
    this._selectedSkill$.next(null);
    this._selectedSkill$.next(null);
  }
}
