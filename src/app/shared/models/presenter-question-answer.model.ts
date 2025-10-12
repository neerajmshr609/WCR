import { AudioMessage } from './message.model';
import { Presenterquestion } from './presenterquestion.model';
import { User } from './user.model';

export class PresenterQuestionAnswer {
  constructor(
    public id?: number,
    public presenterquestion_id?: number,
    public user_id?: number,
    public answer?: string,
    public presenterquestion?: Presenterquestion,
    public project_id?: number,
    public user?: User,
    public audio_message?: AudioMessage,
  ) {}
}
