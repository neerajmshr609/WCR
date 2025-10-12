import { IAdvisorUserProfileIceBreakerResponse } from './response/advisor-user-profile-ice-breaker-response.interface';
import { AdvisorProfileUserSkill } from './advisor-profile-user-skill.model';

export class UserProfileIceBreaker {
  id: number;
  title: string;
  price?: number | null;
  advisor_id?: number;
  created_at: Date;
  index?: number;
  user_skill_id?: number;
  description?: string;

  belongsTo(userSkill: AdvisorProfileUserSkill) {
    return this.user_skill_id === userSkill.id;
  }

  createShareUrl(shareProfileUrl: string, iceBreakersListUrl: string) {
    return [shareProfileUrl, iceBreakersListUrl, this.id.toString()].join('/');
  }
}

export const createUserProfileIceBreaker = (
  src: IAdvisorUserProfileIceBreakerResponse,
  index: number,
) => {
  const dst = new UserProfileIceBreaker();
  Object.assign(dst, {
    ...src,
    index: index + 1,
    created_at: new Date(src.created_at),
  });
  return dst;
};
