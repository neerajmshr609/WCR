import { User } from './user.model';
import { Project } from './project.model';
import { Presenterquestion } from './presenterquestion.model';
import { PresenterQuestionAnswer } from './presenter-question-answer.model';

export class PQACollection {
  constructor(
    public project_id?: number,
    public presenter_question_id?: number,
    public presenterQuestion?: Presenterquestion,
    public answers?: PresenterQuestionAnswer[],
  ) {}
}
