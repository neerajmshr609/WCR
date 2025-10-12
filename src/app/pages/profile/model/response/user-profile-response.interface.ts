import { IUser } from '../../../../shared/models/response/user.interface';
import { IActivityScore } from './activity-score.interface';

// tslint:disable-next-line:no-empty-interface
export interface IUserProfileResponse extends IUser {
  recommended_by_user_id: number;
  activity_score?: IActivityScore;
}