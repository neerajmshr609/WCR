export type OrgMemberState = 'approved' | 'pending' | 'denied';

export interface IAdvisorUserProfileOrgMember {
  id: number;
  organization_id: number;
  org_legal_name: string;
  org_logo?: null | string;
  state: OrgMemberState;
  job_title?: null | string;
  job_description?: null | string;
}