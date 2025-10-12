import { castToIntegerOrZero, isPositiveInteger } from '../../../shared/lib/number.helpers';
import { IActivityScore } from './response/activity-score.interface';

class Activity {
  constructor(
    readonly title: string,
    readonly value = 0,
  ) {
  }

  has() {
    return isPositiveInteger(this.value);
  }
}

export class ActivityScore {
  // connections -> user.activity_score.interested_students
  // conversations -> user.activity_score.returning_students
  // cases reviewed -> user.activity_score.projects_reviewed
  // got recommended -> user.activity_score.got_recommended
  interested_students: Activity;
  conversations_total_size: Activity;
  projects_reviewed: Activity;
  got_recommended: Activity;

  getList() {
    return Object.values(this) as Activity[];
  }

  getListActivitiesHasValues() {
    return this.getList().filter(_ => _.has());
  }

  hasActivity() {
    return Object.values(this).some(_ => _.has());
  }
}

export const createActivityScore = (src?: IActivityScore) => {
  const dst = new ActivityScore();
  dst.interested_students = new Activity('stats.connections', castToIntegerOrZero(src?.interested_students));
  dst.conversations_total_size = new Activity('stats.conversations', castToIntegerOrZero(src?.conversations_total_size));
  dst.projects_reviewed = new Activity('stats.cases_reviewed', castToIntegerOrZero(src?.projects_reviewed));
  dst.got_recommended = new Activity('stats.got_recommended', castToIntegerOrZero(src?.got_recommended));
  return dst;
};