import { IArtCategory } from '../../../artcategory/model/response/artcategory.inteface';

export type SkillArtCategory = Record<'id' | 'name' | 'order', IArtCategory> & { artcategory_id: number };

export interface ISkill {
  id: number;
  shortname: string;
  name: string;
  icon: string;
  link?: null | string;
  advisors_count: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  artcategory_skills?: SkillArtCategory[];
}