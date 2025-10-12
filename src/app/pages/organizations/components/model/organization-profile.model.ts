import { IOrganizationProfileData } from './responses/organization-profile-response.interface';
import { OrganizationMember, organizationMemberFactory } from './organization-member.model';
import { isArrayAndHasItems } from '../../../../shared/lib/array-helpers.lib';
import { OrganizationPartner, organizationPartnerFactory } from './organization-partner.model';
import { Skill, skillFactory } from '../../../../services/skill/model/skill.model';
import { Organization, organizationFactory } from './organization.model';

export class OrganizationProfile {
  organization: Organization;
  all_active_org_members: OrganizationMember[] = [];
  org_partners: OrganizationPartner[] = [];
  org_skills: Skill[] = [];

  get counselors() {
    return this.all_active_org_members;
  }

  get hasCounselors() {
    return !!this.all_active_org_members.length;
  }
}

export const organizationProfileFactory = (src: IOrganizationProfileData) => {
  const dst = new OrganizationProfile();
  dst.organization = organizationFactory(src.organization);
  if (isArrayAndHasItems(src.all_active_org_members)) {
    dst.all_active_org_members = src.all_active_org_members.map(organizationMemberFactory);
  }
  if (isArrayAndHasItems(src.org_partners)) {
    dst.org_partners = src.org_partners.map(organizationPartnerFactory);
  }
  if (isArrayAndHasItems(src.org_skills)) {
    dst.org_skills = src.org_skills.map(skillFactory);
  }
  return dst;
};
