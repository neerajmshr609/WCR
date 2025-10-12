import { ISkill } from '../../../services/skill/model/response/skill.interface';

export interface IAllIceBreakers {
  id: number;
  preview_media_url: string;
  price: number;
  title: string;
  user_skill_id: number;
  description: string | null;
  skills: ISkill[];
}
