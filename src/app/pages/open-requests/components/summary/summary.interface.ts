import { OpenRequestConversation } from '../../../../shared/models/conversation.model';

export interface ISummaryOpenRequest
  extends Pick<OpenRequestConversation, 'summary' | 'request_type'> {}
