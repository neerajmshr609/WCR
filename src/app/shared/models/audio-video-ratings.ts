import { AVRatingParam } from './avratingparam.model';

export interface RatingLevels {
  fileId: string;
  level: number;
  avParam: AVRatingParam;
}
