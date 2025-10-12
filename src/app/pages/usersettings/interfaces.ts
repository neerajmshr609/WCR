import { UntypedFormControl } from '@angular/forms';
import { Ruleset } from 'src/app/shared/models/ruleset';
import { Skill } from '../../shared/models/skill.model';
import {ISkill as IResponseSkill} from '../../services/skill/model/response/skill.interface';

export interface BonusItem {
  percent: string;
  info: string;
}

export interface ComingSoon {
  img: string;
  text: string;
  color: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface LastTransactions {
  amount: number;
  currency: string;
  status: string;
  arrival_date: number;
  created: number;
}

export interface Scheduling {
  appointments_auto_confirmation: boolean;
  live_chat_allowed: boolean;
  rulesets: Ruleset[];
  time_zone: string;
  video_chat_allowed: boolean;
}

export interface ClientForm {
  languages?: string;
  uploadAvatarLabel: string;
  selectedAvatarLabel: string;
  hasReset: boolean;
  avatars: string[];
  inputs: unknown;
  role: string;
  options?: unknown[];
}

export interface ClientForms {
  [key: string]: ClientForm;
}

export interface IOrgs {
  active_orgs: IOrganization[];
  all_orgs_in_platform: IOrganization[];
  closed_orgs: IOrganization[];
  denied_orgs: IOrganization[];
  orgs_waiting_for_requests: IOrganization[];
}

export interface IOrganization {
  id: number;
  user_id?: number;
  legal_name?: string;
  short_name: string;
  email: string;
  description?: string;
  status?: string;
  org_type?: string;
  org_profit_status?: string;
  reg_number?: number;
  org_logo?: string;
  website_url?: string;
  blog_url?: string;
  claim?: string;
  about_short?: string;
  background_image_top?: string;
  background_image_bottom?: string;
  show_contact_form?: boolean;
  org_handle?: string;
  street?: string;
  apartment_number?: number;
  city?: string;
  postal_code?: number;
  vat_number?: number;
  all_free_consultants_auths_in_current_organization?: unknown[];
  free_consultants_histories_pending?: unknown[];
  free_consultants_histories_approved?: unknown[];
  free_consultants_histories_withdrawn?: unknown[];
  free_consultants_histories_denied?: unknown[];
  org_skills?: Skill[];
}

export interface IOrgPartner {
  id: number;
  organization_id?: number;
  name?: string;
  description?: string;
  image?: string;
}

export interface OrgStatuses {
  id: number;
  status: string;
}

export interface Permisson {
  name: string;
  description: string;
  control?: UntypedFormControl;
}

export interface IFormInput {
  label: string;
  placeholder: string;
  name: string;
  type: string;
  description?: string;
  option?: unknown[];
  checked?: boolean;
  array?: unknown[];
}

export interface IFormModel {
  value: string;
  inpName: string;
}

export interface IFormOrgRowDataModel {
  name: string;
  description: string;
  image: string;
  organization_id?: number;
  id?: number;
}

export interface IUserSkills {
  id: number;
  shortname: string;
  name: string;
  icon: string;
  link: string | null;
  advisors_count: number;
  artcategory_skills: unknown[];
}

export interface ISkill {
  skill: number;
  level: number;
}

export interface ISkillLevel {
  id: number;
  name: string;
}

export interface IAction {
  title: string;
  icon: any;
  event: () => void;
}
