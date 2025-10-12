import { BaseResponse } from '../../../../shared/models/base-response.interface';
import { IUser } from '../../../../shared/models/response/user.interface';

export interface IEmailNotificationMuteResponse extends BaseResponse {
  user: IUser;
}