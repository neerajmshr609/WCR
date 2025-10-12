import { ISkill } from '../../../../services/skill/model/response/skill.interface';
import { IUserSkillReview } from './user-skill-review.interface';

export interface IAdvisorUserProfileUserSkills {
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

  reviews: IUserSkillReview[];
  skill: ISkill;

}