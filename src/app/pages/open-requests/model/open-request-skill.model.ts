import { ConversationUserSkill } from '../../../shared/models/ConversationUserSkill.model';
import {
  ConversationUserSkillType,
} from '../../../shared/model-based-components/skill/expertise-title-card/expertise-title-card.interfaces';
import { skillFactory } from '../../../services/skill/model/skill.model';
import { ISkill } from '../../../services/skill/model/response/skill.interface';

class OpenRequestSkill implements ConversationUserSkillType {
  readonly skill;
}

export const openRequestSkillFactory = (
  from: Partial<ConversationUserSkill> & { skill: ISkill },
) => {
  const newOpenRequestSkill = new OpenRequestSkill();
  Object.assign(newOpenRequestSkill, {
    ...from,
    skill: skillFactory(from.skill),
  });
  return newOpenRequestSkill;
};
