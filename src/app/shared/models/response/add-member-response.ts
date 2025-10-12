import { ConversationUserInfo, User } from '../user.model';
import { Conversation } from '../conversation.model';

export interface AddMemberResponse {
  conversation_member?: ConversationUserInfo;
  success: boolean;
  user: User;
}

export interface ConnectMemberResponse {
  conversation?: Conversation;
  conversation_members?: ConversationUserInfo[];
  success: boolean;
}
