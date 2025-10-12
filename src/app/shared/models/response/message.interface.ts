import { IMessageUserInfo } from './message-user-info-interface';
import { IMessageFile } from './message-file.interface';
import { IMessageScreenshot } from './message-screenshot.interface';
import { IAudioMessage } from './message-audio.interface';
import { IMessageDeleted } from './message-deleted.interface';

export interface IMessage {
  user_id?: number; // may should stay
  conversation_id?: number;
  subtitle?: string;
  body?: string;
  audio_message?: IAudioMessage;
  attachment?: IMessageFile;
  special?: string;
  user?: IMessageUserInfo;
  read?: boolean;
  created_at?: string;
  id?: number;
  feedback_id?: number;
  local_timestamp?: number;
  deleted?: IMessageDeleted;

  // TODO: need to be removed
  paymentrequestdenied?: boolean;
  message_payment_session_id?: number;
  paymentrequestamount?: number;
  paymentrequesttime?: number;
  paymentrequestapproved?: boolean;
  icebreaker_question_id?: number;

  message_screenshots?: IMessageScreenshot[];
  message_screenshots_attributes?: IMessageScreenshot[];
  initial_message_id?: number;
  system_message?: boolean;
  replay_message?: IMessage;

  // front-end usage
  isPending?: boolean;
}
