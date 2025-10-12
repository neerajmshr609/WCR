import { IResponseBaseWrap } from './_base-wrap.interface';
import { IUser } from './user.interface';
import { IConversationMember } from './conversation-member.interface';

export interface IAddUserToConversationResponse extends IResponseBaseWrap {
  user: IUser;
  conversation_member: IConversationMember;
}
