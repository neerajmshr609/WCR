import { IResponseBaseWrap } from './_base-wrap.interface';

export interface IConversationMember {
  id: number;
  user_id: number;
  conversation_id: number;
  deleted_at?: null | string;
  created_at: string;
  updated_at: null | string;
}
