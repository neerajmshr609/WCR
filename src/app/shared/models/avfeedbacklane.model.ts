import { AVRatingParam } from './avratingparam.model';
import * as SvgJs from '@svgdotjs/svg.js';
import { Avtimelevel } from './avtimelevel.model';
import { Rating } from './rating.model';

export class Avfeedbacklane {
  constructor(
    public rating_id?: number,
    public projectfile_id?: number,
    public avtimelevels: Avtimelevel[] = [],
    public id?: number,
    public avratingparam_id?: number,
    public local_svgPath?: SvgJs.Path,
    public color?: string,
    public local_avRatingParam?: AVRatingParam,
  ) {}
}

export interface PrintAvfeedbackLane {
  avratingparam: AVRatingParam;
  avtimelevels: Avtimelevel[];
  color: string;
  id: number;
  rating: Rating;
}
