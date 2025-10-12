import { Skill } from '../../services/skill/model/skill.model';

import { Organization } from '../../pages/organizations/components/model/organization.model';

export const REPRESENT_ORGANIZATION_AS = {
  MEMBER_VOLUNTEER: 'member_volunteer',
  EXTERNAL_CONTRACTOR: 'external_contractor',
  MEMBER_EMPLOYED: 'member_employed',
} as const;

export const SHARING_ADVICE_AS = {
  PERSONAL_OPINION: 'personal_opinion',
  CERTIFIED_PROFESSIONAL: 'certified_professional',
} as const;

export type RepresentOrganizationAs =
  (typeof REPRESENT_ORGANIZATION_AS)[keyof typeof REPRESENT_ORGANIZATION_AS];

export type SharingAdviceAs =
  (typeof SHARING_ADVICE_AS)[keyof typeof SHARING_ADVICE_AS];

export interface UserSkillReview {
  student_id: number;
  positive_comment: string;
  negative_comment: string;
}
export class UserSkill {
  id: number;
  user_id?: number;
  skill_id?: number;
  overall_skill_score?: number;
  knowledge_skill_score?: number;
  explanation_skill_score?: number;
  articulation_skill_score?: number;
  politeness_skill_score?: number;
  hours_skill_score?: number;
  skill?: Skill;
  level?: number;
  rate?: number;
  order?: number;
  reviews?: UserSkillReview[];

  organization_name?: string;
  represent_organization_as?: RepresentOrganizationAs;
  sharing_advice_as?: SharingAdviceAs;
}
