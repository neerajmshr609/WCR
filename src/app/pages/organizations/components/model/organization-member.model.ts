import { IOrganizationMember } from './responses/organization-member.interface';

export class OrganizationMember {
  id: number;
  username: string;
  description?: string | null;
  image: string;
}

export const organizationMemberFactory = (src: IOrganizationMember) => {
  const dst = new OrganizationMember();
  return Object.assign(dst, src);
}