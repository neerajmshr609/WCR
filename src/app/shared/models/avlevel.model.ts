import { AVRatingParam } from './avratingparam.model';
import { SVG } from '@svgdotjs/svg.js';

export class AVLevel {
  constructor(
    public timelevels: { [trackTime: number]: number } = {},
    public name?: string,
    public id?: number,
    public start?: number,
    public finish?: number,
    public level?: number,
    public feedback_id?: number,
    // @ts-ignore
    public svgPath?: SVG.Path,
    public avRatingParam?: AVRatingParam,
  ) {}
}
