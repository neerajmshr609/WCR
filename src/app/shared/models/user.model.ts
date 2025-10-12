import { Advisorscore } from './advisor_score.model';
import { UserSkill } from './UserSkill.model';
import { Advisordate } from './Advisordate.model';
import { UserWeblink } from './user-weblink.model';
import { Ruleset } from './ruleset';
import { IceBreaker } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { IUser } from './response/user.interface';
import {
  permissionsFactory,
  Permissions,
} from '../../auth/model/permissions.model';
import { IConversationUserInfo } from './conversation.model';
import { IMessageUserInfo } from './response/message-user-info-interface';
import { ActivityScore } from '../../pages/profile/model/activity-score.model';

export const InviteUserRole = {
  MEMBER: 'member',
  FREECONSUL: 'free_consultant',
} as const;

export type InviteUserRole =
  (typeof InviteUserRole)[keyof typeof InviteUserRole];

export interface IRegisteredUser {
  uid: string;
  name: string;
  id: number;
  state: string;
  nickname: string;
  zzz_image: string;
  email: string;
  city: string;
  zzz_profileimage: string;
  image: string;
  profileimage: string;
  username: string;
  conversations_muted: boolean;
  status: string;
  free_consultants_status: string;
  permissions: string[];
}

export interface UserEmailsInvitedToOrg {
  email: string;
  invite_type: string;
  state?: string;
  id?: number;
}

export interface IRegisteredUsers {
  active: number;
  users: {
    total_count: number;
    data: IRegisteredUser[];
  };
  user_emails_invited_to_org: UserEmailsInvitedToOrg[];
}

// need discussion
export class User {
  org_member_state?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  apartmentNumber?: number;
  zipCode?: number;
  email?: string;
  id?: number;
  jitsiId?: number;
  role?: InviteUserRole;
  admin?: boolean;
  conversations_muted?: boolean;
  referred_by?: number;
  referral_token?: string;
  image?: string;
  imagethumb?: string;
  project_ids?: number[] = [];
  city?: string;
  hours?: string;
  days?: string;
  name?: string;
  username?: string;
  time_zone?: string;
  isteam?: boolean;
  website?: string;
  conversation_ids: number[] = [];
  // public balance?: number,
  showimage?: boolean;
  showcity?: boolean;
  organization?: {
    id: number;
    legal_name: string;
    short_name: string;
  };
  sharetoken?: string;
  showname?: boolean;
  showwebsite?: boolean;
  ratescore?: number;
  isAnonymous?: boolean;
  stripe_user_id?: string;
  stripe_customer_id?: string;
  advisorrate?: number;
  user_skills?: UserSkill[] = [];
  advisordates?: Advisordate[] = [];
  skills?: string[] = [];
  adviserIDs?: number[] = [];
  activity_score?: ActivityScore;
  advisor_score?: Advisorscore;
  lang?: string;

  profileimage?: string;

  showtutorials?: boolean;
  funnelColor?: string;
  queuedprojects?: number[] = [];
  open_cards?: boolean;
  inspiring_rates_count?: number;

  online?: boolean;
  pinned?: boolean;
  user_weblinks?: UserWeblink[] = [];
  video_chat_allowed?: boolean;
  live_chat_allowed?: boolean;
  appointments_auto_confirmation?: boolean;

  rulesets?: Ruleset[];
  pinned_advisors?: number[];
  about?: AboutMe | null;
  icebreakers?: Partial<IceBreaker>[] = [];
  phone_number?: string;
  postal_code?: number;
  country?: string;
  permissions?: Permissions;
  display_name?: string;
}

export interface AboutMe {
  title: string;
  description: string;
}

export class ConversationUserInfo
  extends User
  implements IConversationUserInfo
{
  user_id?: number;
  member_id?: number;
  organization_id?: number | null;
  avatar?: string;
  user_role?: string;
}

const selectUserInstance = (userSrc: IUser | User | IConversationUserInfo) => {
  switch (true) {
    case Number.isInteger((userSrc as IConversationUserInfo)?.member_id):
      return new ConversationUserInfo();
    default:
      return new User();
  }
};

export const userFactory = (
  user: IUser | User | IConversationUserInfo | IMessageUserInfo,
) => {
  const display_name =
    (user as IUser)?.display_name || user.username || (user as IUser)?.name;
  const permissions = (user as IUser)?.permissions
    ? permissionsFactory((user as IUser)?.permissions, !!(user as IUser)?.admin)
    : undefined;
  return Object.assign(selectUserInstance(user), {
    ...user,
    display_name,
    permissions,
  });
};

export const stringifyUsernameAndEmail = ({ username, email }: User) =>
  `${username} (${email})`;
