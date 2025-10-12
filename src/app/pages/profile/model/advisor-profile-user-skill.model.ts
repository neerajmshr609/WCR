import { Skill, skillFactory } from '../../../services/skill/model/skill.model';
import {
  createUserSkillReview,
  UserSkillReview,
} from './user-skill-review.model';
import { IAdvisorUserProfileUserSkills } from './response/advisor-user-profile-user-skills-response.interface';
import { castToArray } from '@helpers-lib/array-helpers.lib';

export class AdvisorProfileUserSkill {
  static readonly MAX_OVERALL_SKILL_SCORE = 100;

  id: number;
  level: number;
  order: number;
  rate: number;
  user_id: number;

  overall_skill_score?: null | number;
  articulation_skill_score?: null | number;
  explanation_skill_score?: null | number;
  hours_skill_score?: null | number;
  knowledge_skill_score?: null | number;
  politeness_skill_score?: null | number;

  reviews: UserSkillReview[];
  skill: Skill;
}

export const createAdvisorProfileUserSkill = (
  src: IAdvisorUserProfileUserSkills,
) => {
  const dst = new AdvisorProfileUserSkill();
  Object.assign(dst, {
    ...src,
    reviews: castToArray(src.reviews).map(createUserSkillReview),
    skill: skillFactory(src.skill),
  });
  return dst;
};
