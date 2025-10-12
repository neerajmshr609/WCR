import { ISkill as IResponseSkill } from '../../../../../services/skill/model/response/skill.interface';
import { IResponseBaseWrap } from '../../../../../shared/models/response/_base-wrap.interface';
import { IOrgPartner } from './organization-partner.interface';
import { IOrganizationMember } from './organization-member.interface';
import { IOrganization } from './organization.interface';


export interface IOrganizationProfileData {
  organization: IOrganization;
  all_active_org_members: IOrganizationMember[];
  org_partners: IOrgPartner[];
  org_skills: IResponseSkill[];
}

export interface IOrganizationProfileDataResponse extends IResponseBaseWrap {
  data?: IOrganizationProfileData;
}
