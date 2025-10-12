import { ConversationUserSkill } from './ConversationUserSkill.model';
import { Lesson } from './lesson.model';
import { Message } from './message.model';
import { PaymentSession } from './payment-session';
import { Project } from './project.model';
import { UserSkill } from './UserSkill.model';
import { IcebreakerMember } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';
import { Skill } from './skill.model';
import { IConversationMember } from './response/conversation-member.interface';
import { ConversationUserInfo, User, userFactory } from './user.model';
import { isArrayAndHasItems } from '../lib/array-helpers.lib';
import { IOpenRequestSummary } from '../../pages/open-requests/model/responses/open-request-summary.interface';
import { openRequestSkillFactory } from '../../pages/open-requests/model/open-request-skill.model';
import { Skill as NewSkill } from '../../services/skill/model/skill.model';
import {
  createQueuedBy,
  QueuedBy,
} from '../../pages/open-requests/model/queued_by.model';

export const ConversationUserRole = {
  MEMBER: 'member',
  CLIENT: 'client',
  CONSULTANT: 'consultant',
  COORDINATOR: 'coordinator',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export type ConversationUserRoleType =
  (typeof ConversationUserRole)[keyof typeof ConversationUserRole];

export interface IConversationUserInfo {
  user_id?: number;
  member_id?: number;
  username?: string;
  profileimage?: string;
  image?: string;
  city?: string;
  online?: boolean;
  video_chat_allowed?: boolean;
  jitsiId?: number;

  // TODO need to add lang on server response
  lang?: string;
}

export interface MessageStatus {
  user_id: number;
  message_id: number;
}

export const ConversationStatus = {
  NO_STAGE: 'no_stage',
  CLIENT_STAGE: 'client_stage',
  OPEN_REQUEST: 'open_request',
  IN_WORK: 'in_work',
  CLOSED: 'closed',
} as const;

export type ConversationStatusType =
  (typeof ConversationStatus)[keyof typeof ConversationStatus];

export const ConversationState = {
  REQUESTS: 'requests',
  GET_SUPPORT: 'get_support',
  WE_CARE: 'we_care',
  SCHEDULED: 'scheduled',
} as const;

export type ConversationStateType =
  (typeof ConversationState)[keyof typeof ConversationState];

export const ConversationType = {
  DIRECT_CHAT: 'direct_chat',
  COMMUNITY_CHAT: 'community_chat',
  ORG_CHAT: 'org_chat',
  CLIENT_CHAT: 'client_chat',
  INTERNAL_CHAT: 'internal_chat',
  FEEDBACK_CHAT: 'feedback_chat',
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export const RequestType = {
  PLATFORM: 'platform',
  ORGANIZATION_DIRECT: 'organization_direct',
  CONSULT_DIRECT: 'consult_direct',
} as const;

export type RequestType = (typeof RequestType)[keyof typeof RequestType];

export class Conversation {
  readonly id: number;
  members: ConversationUserInfo[];
  name?: string;
  image?: string;
  org_logo?: string;
  last_message?: Message;
  project_id?: number;
  advisorrate?: number;
  lastmeetingpaid?: boolean;
  lastmeetingfinished?: boolean;
  lastmeetingconfirmed?: boolean;
  meeting_in_progress?: boolean;
  organization_id?: number;
  current_user_role?: ConversationUserRoleType;
  conversation_type?: ConversationType;
  conversation_status?: ConversationStatusType;
  project?: Project;
  messages: Message[] = [];
  lessons: Lesson[] = [];
  user_skills: UserSkill[] = [];
  conversation_userskill?: ConversationUserSkill;
  isclarification?: boolean;
  unread_message_count?: number;
  last_message_time?: string;
  lastmeetingtime?: string;
  message_payment_sessions?: PaymentSession[];
  created_at?: string;
  rating_created?: string;
  title?: string;
  category_name?: string;
  time_spent?: number;
  sum_awaiting?: number;
  sum_spent?: number;
  sum_denied?: number;
  has_feedback_request?: number;
  icebreaker_member?: IcebreakerMember;

  internal_chat_id?: number;
  icebreaker?: {
    id: number;
    title: string;
    skill: Skill;
  };
  last_reads?: MessageStatus[];
  conversation_skill?: {
    id: number;
    skill: Skill;
  };

  // TODO new field set as optional, need updated it after BE integration

  isOpenRequest?() {
    // TODO: Replace with: this instanceof OpenRequestConversation && this.conversation_status === 'open_request';
    return this.conversation_status === 'open_request';
  }

  isIceBreaker() {
    return (
      typeof this.icebreaker_member === 'object' &&
      this instanceof IceBreakerConversation
    );
  }

  relatesTo(skills: NewSkill[]) {
    const skillName = this.conversation_userskill?.skill?.name;
    return skillName && skills.some((_) => _.name === skillName);
  }

  hasMember(member: ConversationUserInfo) {
    return this.members.some((_) => _.user_id !== member.user_id);
  }

  addMember(member: ConversationUserInfo): void {
    if (!this.hasMember(member)) {
      this.members = [...this.members, member];
    }
  }

  updateMembers(members: ConversationUserInfo[]) {
    this.members = members;
  }

  toConversationIdRequestBody() {
    return { conversation_id: this.id };
  }

  updateState(src: typeof this): typeof this {
    return createConversation({ ...this, ...src }) as typeof this;
  }
}

export class OpenRequestConversation extends Conversation {
  readonly members: ConversationUserInfo[];
  readonly conversation_userskill: ConversationUserSkill;
  readonly conversation_status: 'open_request';
  queued_by: QueuedBy[] = [];
  readonly summary: IOpenRequestSummary;
  readonly topics: string[];
  readonly request_type: RequestType;
  is_in_review_queue = false;

  get firstMemberName() {
    const [firstMember] = this.members;
    let output = firstMember.display_name;
    if (firstMember?.last_name) {
      output += ` ${firstMember?.last_name.slice(0, 1)}`;
    }
    return output;
  }
}

// @ts-ignore
export class IceBreakerConversation extends Conversation {
  icebreaker_member: IcebreakerMember;

  updateIcebreakerMember(icebreaker_member: Partial<IcebreakerMember>) {
    return createConversation({
      ...this,
      icebreaker_member: { ...this.icebreaker_member, ...icebreaker_member },
    }) as IceBreakerConversation;
  }

  completeIcebreaker() {
    return createConversation({
      ...this,
      icebreaker_member: {
        ...this.icebreaker_member,
        complete: true,
      },
    }) as IceBreakerConversation;
  }

  isCompleted(): boolean {
    return this.icebreaker_member.complete;
  }

  isNotLastStage(): boolean {
    return (
      this.icebreaker_member.current_step <
      this.icebreaker_member.total_questions
    );
  }

  get icebreakerTitle() {
    return this.icebreaker_member.title;
  }

  hasNextSteps(): boolean {
    return !this.isCompleted() && this.isNotLastStage();
  }

  isLastStep(): boolean {
    return (
      this.icebreaker_member.current_step ===
      this.icebreaker_member.total_questions
    );
  }

  isOwner(user: User): boolean {
    return this.icebreaker_member.owner_id === user.id;
  }

  get icebreakerId() {
    return this.icebreaker_member.id;
  }
}

const selectConversationInstanceType = (fromSrc) => {
  switch (true) {
    case typeof fromSrc.icebreaker_member === 'object' &&
      fromSrc.icebreaker_member !== null:
      return new IceBreakerConversation();
    case fromSrc.conversation_status === 'open_request':
      return new OpenRequestConversation();
    default:
      return new Conversation();
  }
};

export function createConversation(fromSrc) {
  const newConversation = selectConversationInstanceType(fromSrc);
  const members = isArrayAndHasItems(fromSrc.members)
    ? fromSrc.members.map(userFactory)
    : [];
  const conversation_userskill = fromSrc.conversation_userskill
    ? openRequestSkillFactory(fromSrc.conversation_userskill)
    : undefined;
  const image = fromSrc?.image;
  const queued_by = isArrayAndHasItems(fromSrc.queued_by)
    ? fromSrc.queued_by.map(createQueuedBy)
    : [];
  Object.assign(newConversation, {
    ...fromSrc,
    image,
    members,
    conversation_userskill,
    queued_by,
  });
  return newConversation;
}

export interface CreateNewConversationDTO {
  conversation_type: string;
  user_id?: number;
  image?: string;
  name?: string;
}

export interface CreatedConversation {
  status: string;
  conversation: Conversation;
  conversation_members: IConversationMember[];
}
