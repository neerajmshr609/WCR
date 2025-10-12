import { IResponseBaseWrapPaginated } from '../../../../shared/models/response/_base-wrap-paginated';
import {
  Conversation,
  ConversationStatusType,
  ConversationType,
  IConversationUserInfo,
} from '../../../../shared/models/conversation.model';
import { ConversationUserSkill } from '../../../../shared/models/ConversationUserSkill.model';
import { IQueuedBy } from './queued-by.interface';
import { IOpenRequestSummary } from './open-request-summary.interface';

export type OpenRequestDataItem = Partial<Conversation> & {
  id: number;
  members: IConversationUserInfo[];
  conversation_userskill: Partial<ConversationUserSkill> | null;
  conversation_status: ConversationStatusType | null;
  conversation_type: ConversationType;
  queued_by: IQueuedBy[];
  summary: IOpenRequestSummary;
  is_in_review_queue: boolean;
};

export interface IOpenRequestResponse extends IResponseBaseWrapPaginated {
  conversations: {
    data: OpenRequestDataItem[];
  };
}
