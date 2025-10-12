import { IResponseBaseWrap } from './_base-wrap.interface';

export interface IResponseBaseWrapPaginated extends IResponseBaseWrap {
  total_count: number;
}
