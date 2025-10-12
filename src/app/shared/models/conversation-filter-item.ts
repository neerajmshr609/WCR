import {
  ConversationState,
  ConversationStateType,
  ConversationType,
} from './conversation.model';

export interface ConversationFilterItem {
  name: ConversationType | ConversationStateType;
  title: string;
  selected?: boolean;
  meta?: {
    messages?: number;
    mentions?: number;
    schedule?: number;
  };
}
