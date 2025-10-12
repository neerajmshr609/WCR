import { Artcategory } from './artcategory.model';
import { LANGUAGES_CODE } from '../app-language/data';

export interface ISkillTranslation {
  id: number;
  locale?: (typeof LANGUAGES_CODE)[keyof typeof LANGUAGES_CODE];
  name?: string;
  shortname?: string;
  _destroy?: boolean;
}
export class Tag extends Artcategory {
  artcategory_skill_id?: number;
  artcategory_id?: number;
  _destroy?: number;
}
// ---> Skills in future is Topic

export class Skill {
  id: number;
  shortname?: string;
  name?: string;
  icon?: string;
  link?: string;
  artcategory_skills_attributes?: Tag[];
  artcategory_skills?: Tag[];
  advisors_count?: number;
  translations_attributes?: ISkillTranslation[];
  order?: number;
}

export const skillFactory = (from: Partial<Skill>) => {
  const skill = new Skill();
  Object.assign(skill, from);
  return skill;
};
