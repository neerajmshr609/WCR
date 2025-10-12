import { IResponseBaseWrap } from '../../../../shared/models/response/_base-wrap.interface';
import { OpenRequestDataItem } from './open-request-response.interface';


export interface IAddToReviewQueueResponse extends IResponseBaseWrap {
  conversation: OpenRequestDataItem;
}
