import { IResponseBaseWrap } from './_base-wrap.interface';
import { IUser } from './user.interface';

export interface IUsersSearchResponse extends IResponseBaseWrap {
  users: IUser[];
}
