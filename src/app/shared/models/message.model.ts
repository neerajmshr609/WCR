import { avFileStateEnum } from '../enums';
import { IMessageFile } from './response/message-file.interface';
import { IMessageScreenshot } from './response/message-screenshot.interface';
import { IAudioMessage } from './response/message-audio.interface';
import { IMessageDeleted } from './response/message-deleted.interface';
import { User, userFactory } from './user.model';
import { IMessage } from './response/message.interface';
import { Lesson } from './lesson.model';

export class MessageFile {
  url: string;
  mimetype: string;
  name: string;
  kind: string;
  thumbnail: string | null;
  loadState: avFileStateEnum;
}

export const messageFileFactory = (src: IMessageFile) => {
  return Object.assign(new MessageFile(), { ...src });
};

export class MessageScreenshot {
  url?: string;
  file?: File;
}

export const messageScreenshotFactory = (src: IMessageScreenshot) => {
  return Object.assign(new MessageScreenshot(), { ...src });
};

export class AudioMessage {
  url: string;
  duration?: number;
  language?: string;
}

export const audioMessageFactory = (src: IAudioMessage) => {
  return Object.assign(new AudioMessage(), { ...src });
};

export class MessageDeleted {
  deleted_at: Date;
  deleted_by: User;
}

export const messageDeletedFactory = (
  src: IMessageDeleted | MessageDeleted,
) => {
  const dst = new MessageDeleted();
  dst.deleted_at = new Date(src.deleted_at);
  dst.deleted_by = userFactory(src.deleted_by);
  return dst;
};

export type MessageSpecial =
  | 'regular'
  | 'change_rate'
  | 'meeting_accepted'
  | 'meeting_denied'
  | 'paid_feedback_request'
  | 'instant_feedback_request'
  | 'payment_accepted'
  | 'payment_denied'
  | 'stripe_connected'
  | 'unconnected_payment_intent'
  | 'meeting_request'
  | 'conversation_name_changed'
  | 'conversation_image_changed'
  | 'payment_session_created'
  | 'lesson_created'
  | 'yes_no_question'
  | 'answer'
  | 'member_added'
  | 'member_removed'
  | 'approve_counsellor_question'
  | 'case_taken'
  | 'request_type_changed'
  | 'personal_info'; // TODO: need to check personal info after it is implemented on server

export class Message {
  user_id?: number; // may should stay
  conversation_id?: number;
  subtitle?: string;
  body?: string;
  audio_message?: IAudioMessage;
  attachment?: MessageFile;
  special?: MessageSpecial;
  user?: User;
  read?: boolean;
  created_at?: string;
  id?: number;
  feedback_id?: number;
  local_timestamp?: number;
  deleted?: MessageDeleted;
  isMessage? = true;
  service_info?: Lesson;
  username?: string;

  // TODO: need to be removed
  paymentrequestdenied?: boolean;
  message_payment_session_id?: number;
  paymentrequestamount?: number;
  paymentrequesttime?: number;
  paymentrequestapproved?: boolean;
  icebreaker_question_id?: number;

  message_screenshots?: MessageScreenshot[];
  message_screenshots_attributes?: MessageScreenshot[];
  initial_message_id?: number;
  system_message?: boolean;
  replay_message?: Message;

  // front-end usage
  isPending?: boolean;
  message_type?:
    | 'regular'
    | 'yes_no_question'
    | 'personal_info_question'
    | 'add_user'
    | 'delete_user';
  additional_attributes?: any;
}

const createEmptyMessageInstance = (src: IMessage | Message) => {
  switch (true) {
    default:
      return new Message();
  }
};

export function messageFactory(src: IMessage | Message) {
  if (!src) {
    return;
  }
  const dst = createEmptyMessageInstance(src);
  Object.assign(dst, {
    ...src,
    isPending: false,
  });
  if (src.audio_message) {
    dst.audio_message = audioMessageFactory(src.audio_message);
  }
  if (src.attachment) {
    dst.attachment = messageFileFactory(src.attachment);
  }

  if (src.user) {
    dst.user = userFactory(src.user);
  }

  if (src.deleted) {
    dst.deleted = messageDeletedFactory(src.deleted);
  }

  if (Array.isArray(src.message_screenshots)) {
    dst.message_screenshots = src.message_screenshots.map(
      messageScreenshotFactory,
    );
  }

  if (Array.isArray(src.message_screenshots_attributes)) {
    dst.message_screenshots_attributes = src.message_screenshots_attributes.map(
      messageScreenshotFactory,
    );
  }

  if (src.replay_message) {
    dst.replay_message = messageFactory(src.replay_message);
  }

  return dst;
}
