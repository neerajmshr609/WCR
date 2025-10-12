import { AVRatingParam } from './avratingparam.model';
import { AudioMessage } from './message.model';

export class Feedback {
  constructor(
    public text?: string,
    public order?: number,
    public feedbacktype?: string,
    public created_at?: string,
    public link?: string,
    public id?: number,
    public drawing?: string,
    public screenshot?: string,
    public screenshotLoading?: boolean,
    public file?: string,
    public avratingparam_id?: number,
    public avtracktimeposition?: number,
    public in_open_card_session?: boolean,
    public local_avratingparam?: AVRatingParam,
    public audio_message?: AudioMessage,
    public face_uid?: string,
    public projectfile_id?: number,
  ) {}
}
