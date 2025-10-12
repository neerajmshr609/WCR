import { User, userFactory } from '../../../shared/models/user.model';
import { ActivityScore, createActivityScore } from './activity-score.model';
import { AdvisorUserProfileMergedResponse } from './response/advisor-user-profile-merge-response.interface';
import { IAdvisorUserProfileAdvisorScoreResponse } from './response/advisor-user-profile-advisor-score-response.interface';
import {
  createUserProfileIceBreaker,
  UserProfileIceBreaker,
} from './user-profile-ice-breaker.model';
import {
  AdvisorProfileUserSkill,
  createAdvisorProfileUserSkill,
} from './advisor-profile-user-skill.model';
import { castToArray } from '@helpers-lib/array-helpers.lib';
import { createLanguage, Language } from './language.model';
import {
  createOrgMember,
  UserProfileOrgMember,
} from './user-profile-org-member.model';
import { IUpdateJobTitleDescription } from './response/update-job-title-description-response.interface';
import { IAdvisorUserProfileIceBreakerResponse } from './response/advisor-user-profile-ice-breaker-response.interface';

export class UserProfile extends User {
  recommended_by_user_id: number;

  activity_score: ActivityScore;
  icebreakers: UserProfileIceBreaker[];
  conversations_muted: boolean;

  advisor_score: IAdvisorUserProfileAdvisorScoreResponse;
  imagethumb: string;
  inspiring_rates_count: 0;
  rulesets: [];
  skills: string[];
  // @ts-ignore
  user_skills: AdvisorProfileUserSkill[];
  languages: Language[];
  advisordates: [];
  adviserIDs: [];
  org_member: null | UserProfileOrgMember;

  isOrganizationMember() {
    return this.org_member !== null;
  }

  isProfileOwner(user: User) {
    return this.id === user.id;
  }

  isRecommended(byUser: User) {
    return this.recommended_by_user_id === byUser.id;
  }

  updateOrMemberInfo(data: IUpdateJobTitleDescription) {
    this.org_member = this.org_member.update(data);
    return this;
  }

  deleteIceBreaker(iceBreakerId: number) {
    this.icebreakers = this.icebreakers.filter(
      (iceBreaker) => iceBreaker.id !== iceBreakerId,
    );
    return this;
  }
}

export const userProfileFactory = (data: AdvisorUserProfileMergedResponse) => {
  const src = userFactory(data);
  const dst = new UserProfile();
  Object.assign(dst, {
    ...src,
    activity_score: createActivityScore(data.activity_score),
    icebreakers: castToArray<IAdvisorUserProfileIceBreakerResponse>(
      data.icebreakers,
    )
      .sort((a, b) => a.id - b.id)
      .map(createUserProfileIceBreaker),
    user_skills: castToArray(data.user_skills).map(
      createAdvisorProfileUserSkill,
    ),
    languages: data.lang
      ? castToArray(data.lang.split(',')).map(createLanguage)
      : [],
    org_member: createOrgMember(data.org_member),
  });
  return dst;
};
