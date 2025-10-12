import { User } from './user.model';
import { Project } from './project.model';
import { Feedback } from './feedback.model';

export class Rating {
  constructor(
    public user?: User,
    public project?: Project,
    public project_id?: number,
    public user_id?: number,
    public categoryrelation_id?: number,
    public projectfile_id?: string,
    public feedbacks_attributes?: Feedback[],
    public avfeedbacklanes_attributes?: any,
    public feedbacks?: Feedback[],
    public ratingtype?: string,
    public slidervalue?: number,
    public feedbacksession_id?: number,
    public id?: number,
    public screenshot?: string,
    public order?: number,
  ) {}
}
