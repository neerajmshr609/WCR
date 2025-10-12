import { IActivityScore } from './activity-score.interface';
import { IUser } from '../../../../shared/models/response/user.interface';
import { IAdvisorUserProfileIceBreakerResponse } from './advisor-user-profile-ice-breaker-response.interface';
import { IAdvisorUserProfileUserSkills } from './advisor-user-profile-user-skills-response.interface';
import { IAdvisorUserProfileAdvisorScoreResponse } from './advisor-user-profile-advisor-score-response.interface';
import { IAdvisorUserProfileOrgMember } from './advisor-user-profile-org-member.interface';

export interface IAdvisorUserProfileResponse extends IUser {
  advisor_score: IAdvisorUserProfileAdvisorScoreResponse;
  imagethumb: string;
  inspiring_rates_count: 0;
  rulesets: [];
  skills: string[];
  user_skills: IAdvisorUserProfileUserSkills[];
  activity_score: IActivityScore;
  advisordates: [];
  adviserIDs: [];
  icebreakers: IAdvisorUserProfileIceBreakerResponse[];
  lang: null | string;
  org_member: null | IAdvisorUserProfileOrgMember[];
}