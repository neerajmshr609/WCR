import { UserProfileOrgMember } from '../user-profile-org-member.model';

export type OrgMemberJob = Partial<UserProfileOrgMember>
  & {
  job_title?: null | string;
  job_description?: null | string;
};