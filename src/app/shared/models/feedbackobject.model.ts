import { Feedback } from './feedback.model';

export class Feedbackobject {
  constructor(
    public ratingtype: string,
    public feedbacks: Feedback[],
    public fileId?: string,
    public slidervalue?: number,
    public sliderdragged?: boolean,
    public file_id?: number,
    public feedbacksession_id?: number,
    public id?: number,
    public user_id?: number,
    public created_at?: string,
    public open_card_session?: boolean,
    public display_name?: string,
  ) {}
}
