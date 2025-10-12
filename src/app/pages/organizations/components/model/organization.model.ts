import { IOrganization } from './responses/organization.interface';

export class Organization {
  id: number;
  short_name: string;
  legal_name: string;
  email: string;
  description: string;
  website_url: string;
  blog_url: string;
  claim: string;
  about_short: string;
  background_image_top: string;
  background_image_bottom: string;
  show_contact_form: boolean;
}

export const organizationFactory = (src: IOrganization) => {
  const dst = new Organization();
  return Object.assign(dst, src);
};
