import { IAdvisorUserProfileOrgMember, OrgMemberState } from './response/advisor-user-profile-org-member.interface';
import { isArrayAndHasItems } from '../../../shared/lib/array-helpers.lib';

export class UserProfileOrgMember {
  id: number;
  organization_id: number;
  org_legal_name: string;
  org_logo?: null | string;
  state: OrgMemberState;
  job_title?: null | string;
  job_description?: null | string;

  isSameOrgMember(org_member: Partial<UserProfileOrgMember> & { id: number }) {
    return this.id === org_member.id;
  }

  update(fromSrc: Partial<UserProfileOrgMember>) {
    return createOrgMember([{ ...this, ...fromSrc }]);
  }
}

export const createOrgMember = (src?: IAdvisorUserProfileOrgMember[] | null) => {
  if (!isArrayAndHasItems(src)) {
    return null;
  }
  const [srcItem] = src;
  const dst = new UserProfileOrgMember();
  Object.assign(dst, srcItem);
  return dst;
};