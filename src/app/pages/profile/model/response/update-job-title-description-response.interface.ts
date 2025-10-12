import { OrgMemberState } from './advisor-user-profile-org-member.interface';

export interface IUpdateJobTitleDescription {
  created_at: string;
  id: number;
  is_admin: boolean;
  job_description?: null | string;
  job_title?: null | string;
  organization_id: number;
  state: OrgMemberState;
  updated_at: string;
  user_id: number;
}