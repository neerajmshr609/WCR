import { IMessageUserInfo } from './message-user-info-interface';
import { BaseResponse } from '../base-response.interface';
import { IMessage } from './message.interface';

export interface IMessageDeleted {
  deleted_at: string | Date;
  deleted_by: IMessageUserInfo;
}

export interface ISoftDeleteMessageResponse extends BaseResponse {
  user_message: IMessage & {
    body: null;
    deleted: IMessageDeleted;
  };
}