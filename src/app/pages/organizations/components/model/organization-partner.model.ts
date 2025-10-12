import { IOrgPartner } from './responses/organization-partner.interface';

export class OrganizationPartner {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const organizationPartnerFactory = (src: IOrgPartner) => {
  const dst = new OrganizationPartner();
  return Object.assign(dst, src);
};