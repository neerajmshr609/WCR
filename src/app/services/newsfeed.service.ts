import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  API_URL,
  FEEDBACK_SESSIONS_URL,
  FEEDBACK_URL,
} from 'src/config/config';
import { createHttpParams } from '../shared/functions/http-params';
import { NewsfeedFeedback } from '../shared/models/newsfeedfeedback.model';
import { Newsfeedfollow } from '../shared/models/newsfeedfollow.model';
import { PresenterQuestionAnswer } from '../shared/models/presenter-question-answer.model';
import { Presenterquestion } from '../shared/models/presenterquestion.model';
import { Project } from '../shared/models/project.model';
import { Projectfile } from '../shared/models/projectfile.model';
import { User } from '../shared/models/user.model';
import { FeedbackSession } from '../shared/models/feedback-session';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NewsfeedService {
  avShouldStopExcludingSenderNotification$ = new BehaviorSubject<{
    senderFileId: string;
  }>(null);

  constructor(private http: HttpClient) {}

  updateFeedbackLang(
    id: number,
    feedback: Partial<NewsfeedFeedback>,
  ): Observable<NewsfeedFeedback> {
    return this.http.put<NewsfeedFeedback>(FEEDBACK_URL(id), { feedback });
  }

  fetchAdvisors(onlineOnly: boolean) {
    let url = API_URL + 'advisors';
    url += onlineOnly ? '?online=' + true : '';

    return this.http.get<User[]>(url);
  }

  fetchNewsfeedfollows() {
    const url = API_URL + 'newsfeedfollows/';

    return this.http.get<Newsfeedfollow[]>(url);
  }

  updateRatebackForFeedback(feedback_id: number, new_value: number) {
    const url = API_URL + 'update_rateback/';

    return this.http.put(url, { new_value, feedback_id });
  }

  addAnswerToQuestion(presenterquestionanswer: PresenterQuestionAnswer) {
    const url = API_URL + 'presenterquestionanswers/';

    return this.http.post(url, { presenterquestionanswer });
  }

  deleteFollow(artist_id: number, user_id: number) {
    const url = API_URL + 'removenewsfeedfollow/';
    const follow = { user_id, artist_id };

    return this.http.post(url, { newsfeedfollow: follow });
  }

  createFollow(
    artist_id?: number,
    user_id?: number,
    commenter_id?: number,
    project_id?: number,
  ) {
    const url = API_URL + 'addnewsfeedfollow/';

    const follow = { user_id, artist_id, commenter_id, project_id };

    return this.http.post(url, { newsfeedfollow: follow });
  }

  fetchMediaForFeedbackID(feedbackID: number) {
    const url =
      API_URL + 'newsfeed_feedback_media_url?feedbackID=' + feedbackID;

    return this.http.get<Projectfile[]>(url);
  }

  fetchInspiringFeedbacksForUserID(userId: number) {
    const url = API_URL + 'newsfeed_feedbacks_inspiring?userID=' + userId;

    return this.http.get<NewsfeedFeedback[]>(url);
  }

  fetchFeedbacksForMediaType(
    mediatypes: string[],
    categories: number[],
    page: number,
  ) {
    if (!mediatypes?.length) {
      mediatypes = ['image', 'audio', 'video'];
    }

    const url = API_URL + 'newsfeed_feedbacks';
    const params = createHttpParams({
      mediatypes: mediatypes.join('|'),
      ...(categories.length && { categories }),
      page,
    });

    return this.http.get<{ total_count: number; data: NewsfeedFeedback[] }>(
      url,
      { params },
    );
  }

  fetchPresenterQuestions(
    mediatypes: string[],
    page: number,
    categories: number[],
  ) {
    if (!mediatypes?.length) {
      mediatypes = ['image', 'audio', 'video'];
    }

    const url = API_URL + 'presenter_questions';
    const params = createHttpParams({
      mediatypes: mediatypes.join('|'),
      page,
      feedback_id: true,
      ...(categories.length && { categories }),
    });

    return this.http.get<{ total_count: number; data: Presenterquestion[] }>(
      url,
      { params },
    );
  }

  fetchFeedbacklanesForRating(ratingID: number) {
    const url =
      API_URL +
      'avfeedbacklanes?ratingID=' +
      ratingID +
      '&newsfeed_request=true';

    return this.http.get<Array<any>>(url);
  }

  fetchChoosethebest(page: number, categories: number[]) {
    const url = API_URL + 'choosethebest_projects';
    const params = createHttpParams({
      page,
      ...(categories.length && { categories }),
    });

    return this.http.get<{ total_count: number; data: Project[] }>(url, {
      params,
    });
  }

  saveFileLike(file: Projectfile) {
    const url = API_URL + 'projectfiles/' + file.id + '?newsfeed_request=true';

    return this.http.put<Projectfile>(url, {
      projectfile: {
        likecount: file.likecount + 1,
      },
    });
  }

  fetchFeedbackSessions(project_id: number): Observable<FeedbackSession[]> {
    const params = createHttpParams({
      project_id,
    });

    return this.http
      .get(FEEDBACK_SESSIONS_URL, { params })
      .pipe(map((res: FeedbackSession[]) => res));
  }
}
