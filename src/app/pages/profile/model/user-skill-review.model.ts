import { IUserSkillReview } from './response/user-skill-review.interface';

export class UserSkillReview {
  explanation_rate?: null | number;
  knowledge_rate?: null | number;
  negative_comment?: null | number;
  politeness_rate?: null | number;
  positive_comment?: null | number;
  pronunciation_rate?: null | number;
  student_id: number;
}

export const createUserSkillReview = (src: IUserSkillReview) => {
  const dst = new UserSkillReview();
  Object.assign(dst, src);
  return dst;
};