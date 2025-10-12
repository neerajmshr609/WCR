import {
  Conversation,
  ConversationState,
  ConversationStateType,
  ConversationStatus,
  ConversationType,
  ConversationUserRole,
} from '../models/conversation.model';

type ReturnConversationType = ConversationType | ConversationStateType;

export function returnConversationType(
  conversation: Conversation,
): ReturnConversationType {
  if (
    conversation.conversation_type === ConversationType.CLIENT_CHAT &&
    conversation.conversation_status === ConversationStatus.OPEN_REQUEST &&
    conversation.current_user_role === ConversationUserRole.CONSULTANT
  ) {
    return ConversationState.REQUESTS;
  }

  if (
    conversation.conversation_type === ConversationType.CLIENT_CHAT &&
    conversation.conversation_status === ConversationStatus.IN_WORK &&
    conversation.current_user_role === ConversationUserRole.CONSULTANT
  ) {
    return ConversationState.WE_CARE;
  }

  if (
    conversation.conversation_type === ConversationType.CLIENT_CHAT &&
    conversation.current_user_role === ConversationUserRole.CLIENT &&
    conversation.conversation_status !== ConversationStatus.NO_STAGE
  ) {
    return ConversationState.GET_SUPPORT;
  }

  if (
    conversation.conversation_type === ConversationType.CLIENT_CHAT &&
    conversation.current_user_role === ConversationUserRole.CLIENT &&
    conversation.conversation_status === ConversationStatus.NO_STAGE
  ) {
    return ConversationState.REQUESTS;
  }

  return conversation.conversation_type;
}

export function returnTypeEntity(type: ReturnConversationType) {
  if (type === ConversationState.REQUESTS) {
    return {
      conversation_type: ConversationType.CLIENT_CHAT,
      conversation_status: ConversationStatus.OPEN_REQUEST,
      current_user_role: ConversationUserRole.CONSULTANT,
    };
  }

  if (type === ConversationState.WE_CARE) {
    return {
      conversation_type: ConversationType.CLIENT_CHAT,
      conversation_status: ConversationStatus.IN_WORK,
      current_user_role: ConversationUserRole.CONSULTANT,
    };
  }

  if (type === ConversationState.GET_SUPPORT) {
    return {
      conversation_type: ConversationType.CLIENT_CHAT,
      current_user_role: ConversationUserRole.CLIENT,
    };
  }

  return { conversation_type: type };
}
