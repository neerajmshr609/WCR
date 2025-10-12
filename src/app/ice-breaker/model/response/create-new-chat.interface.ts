import { IAnonymousUserResponse } from 'src/app/auth/model/anonymous-user-response.interface';
import { BaseResponse } from 'src/app/shared/models/base-response.interface';
import { Conversation } from 'src/app/shared/models/conversation.model';

export interface ICreateNewChat extends BaseResponse {
  conversation: Conversation & Partial<IAnonymousUserResponse>;
}
