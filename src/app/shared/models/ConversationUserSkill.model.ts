import { Skill } from './skill.model';

export class ConversationUserSkill {
  id: number;
  user_skill_id?: number;
  conversation_id?: number;
  skill: Skill;
  rate?: number;
}
