import { MessageSpecial } from './message.model';

export interface MessageWs {
  id: number;
  conversation_id: number;
  user_id: number;
  body: string;
  updated: boolean;
  special?: MessageSpecial;
  muted: boolean;
  avatar: string;
  username: string;

  additional_attributes?: any;
  created_at?: string;
  feedback_id?: number;
  initial_message_id?: number;
  isPending?: boolean;
  local_timestamp?: number;
  message_payment_session_id?: number;
  read?: boolean;
  service_info?: any; // Do we need it here??
  type?: 'default' | 'yes_no_question';
  display_name?: string;
}

export class WsMessage implements MessageWs {
  id: number;
  conversation_id: number;
  user_id: number;
  body: string;
  updated: boolean;
  special?: MessageSpecial;
  muted: boolean;
  avatar: string;
  username: string;

  additional_attributes?: any;
  created_at?: string;
  feedback_id?: number;
  initial_message_id?: number;
  isPending?: boolean;
  local_timestamp?: number;
  message_payment_session_id?: number;
  read?: boolean;
  service_info?: any; // Do we need it here??
  type?: 'default' | 'yes_no_question';
  display_name?: string;
}

export const createWsMessage = (src: MessageWs) => {
  const dst = new WsMessage();
  Object.assign(dst, {
    ...src,
    display_name: src?.display_name || src.username,
  });
  return dst;
};
