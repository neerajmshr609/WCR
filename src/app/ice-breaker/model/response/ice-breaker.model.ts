import { Skill, skillFactory } from '../../../services/skill/model/skill.model';
import { IAllIceBreakers } from './all-ice-breakers.interface';
import { isArrayAndHasItems } from '../../../shared/lib/array-helpers.lib';

export class IceBreaker {
  id: number;
  title: string;
  price: number;
  user_skill_id: number;
  preview_media_url: string;
  description: string | null = null;
  skills: Skill[] = [];

  get icon() {
    return isArrayAndHasItems(this.skills) ? this.skills[0].icon : null;
  }

  get skillName() {
    return isArrayAndHasItems(this.skills) ? this.skills[0].name : '';
  }

  get counselorsAmount() {
    return this.skills.reduce((sum, _) => sum + _.advisors_count, 0);
  }

  belongsTo(skills: Skill[]) {
    return skills.some((skill) => this.skills.some((_) => skill.isEqualTo(_)));
  }

  isEqualTo(iceBreaker: IceBreaker) {
    return this.id === iceBreaker.id;
  }
}

export const iceBreakerFactory = (
  src: IAllIceBreakers,
  updateWithSkills: Skill[],
) => {
  const iceBreaker = new IceBreaker();
  const skills = (src.skills || []).map(
    (_) =>
      updateWithSkills.find((skill) => skill.id === _.id) || skillFactory(_),
  );
  Object.assign(iceBreaker, {
    ...src,
    skills,
  });
  return iceBreaker;
};
