import { Skill } from '../../../models/skill.model';
import { Conversation } from '../../../models/conversation.model';
import { ConversationUserSkill } from '../../../models/ConversationUserSkill.model';
import { ConversationUserInfo } from '../../../models/user.model';

type Member = Partial<ConversationUserInfo> & { username: string };

export type ConversationUserSkillType = Partial<ConversationUserSkill> & {
  skill: Partial<Skill> & { name: string };
};

export type ExpertiseTitleCardInput = Partial<Conversation> & {
  members: Member[];
  conversation_userskill: ConversationUserSkillType;
  get firstMemberName(): string;
};
