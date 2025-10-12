import * as SvgJs from '@svgdotjs/svg.js';

export interface RatingRecord {
  type: 'start' | 'end'; // 'start' | 'end'
  tick: number;
  level?: number;
}

export interface Curve {
  avParamId: number;
  fileId: number;
  ratingRecords: RatingRecord[];
  color: string;
  active: boolean;
  svgPath: SvgJs.Path;
  lastLevel: number;
  algorithmTick: number;
}
