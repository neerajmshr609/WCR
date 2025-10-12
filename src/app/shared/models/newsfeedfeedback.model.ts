import { Feedback } from './feedback.model';
import { NewsfeedQuestionType } from '../enums';
import { Project } from './project.model';
import { Projectfile } from './projectfile.model';
import { AVRatingParam } from './avratingparam.model';

export class NewsfeedFeedback extends Feedback {
  constructor(
    public text?: string,
    public order?: number,
    public feedbacktype?: string,
    public created_at?: string,
    public link?: string,
    public id?: number,
    public display_type?: string,
    public profileimage?: string,
    public newsfeed_question_type?: NewsfeedQuestionType,
    public score?: number,
    public rateback_score?: number,
    public rating_id?: number,
    public project_id?: number,
    public projectfile_id?: number,
    public projectfile?: Projectfile,
    public project_category?: string,
    public choose_the_best_project?: Project,
    public project_sharetoken?: string,
    public presenter_project?: Project,
    public presenter_question_id?: number,
    public commenter_id?: number,
    public avratingparam?: AVRatingParam,
    public artist_id?: number,
    public feedbacksession_id?: number,
    public wasPaid?: boolean,
    public isprofeedback?: boolean,
    public userFeedbacksResorts?: NewsfeedFeedback[],
    public userFeedbacksStrengths?: NewsfeedFeedback[],
    public userFeedbacksWeaknesses?: NewsfeedFeedback[],
    public userFeedbacksNextsteps?: NewsfeedFeedback[],
    public userFeedbacksLinks?: NewsfeedFeedback[],
    public following?: boolean,
    public localStorageFollowID?: number,
  ) {
    super(text, order, feedbacktype, created_at, link, id, display_type);
  }
}
