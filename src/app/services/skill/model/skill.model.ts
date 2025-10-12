import { ISkill } from './response/skill.interface';
import {
  ArtCategory,
  artCategoryFactory,
} from '../../artcategory/model/artcategory.model';
import { toMeaningfulStr } from '@helpers-lib/string-helpers';
import { getRandomAvatarSrc } from '../../../pages/usersettings/constants/avatars';

export class Skill {
  id: number;
  shortname: string;
  name: string;
  icon: string = getRandomAvatarSrc();
  advisors_count: number;
  artcategory_skills: ArtCategory[] = [];
  order?: number;

  belongsTo(artCategories: ArtCategory[]) {
    return artCategories.some((cat) =>
      this.artcategory_skills.some((_) => _.id === cat.id),
    );
  }

  contains(strFilter: string): boolean {
    const meaningfulFilterStr = toMeaningfulStr(
      (this.name || '') + (this.shortname || ''),
    );
    return meaningfulFilterStr.includes(strFilter);
  }

  isEqualTo(skill: Skill): boolean {
    return skill.id === this.id;
  }

  get renderName() {
    return this.shortname;
  }

  get renderChipName() {
    return this.shortname;
  }
}

export const skillFactory = (skill: ISkill | Skill) => {
  const newSkill = new Skill();

  newSkill.id = skill.id;
  newSkill.shortname = skill.shortname;
  newSkill.name = skill.name;
  newSkill.icon = skill.icon;
  newSkill.advisors_count = skill.advisors_count;

  // @ts-ignore
  newSkill.artcategory_skills = (skill.artcategory_skills || []).map((_) =>
    artCategoryFactory(_),
  );

  ['created_at', 'updated_at', 'deleted_at'].forEach((key) => {
    if (typeof skill[key] === 'string') {
      newSkill[key] = new Date(skill[key]);
    }
  });
  return newSkill;
};
