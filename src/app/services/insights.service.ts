import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_URL,
  DISCONNECTED_USERS_URL,
  FEEDBACK_SESSIONS_STATUS_UPDATE_URL,
  FEEDBACK_SESSION_URL,
} from 'src/config/config';
import { FEEDBACKS_URL } from 'src/config/config';
import { createHttpParams } from '../shared/functions/http-params';
import { Feedback } from '../shared/models/feedback.model';
import { Feedbackobject } from '../shared/models/feedbackobject.model';
import { Funnel } from '../shared/models/funnel.model';
import { Message } from '../shared/models/message.model';
import { NewsfeedFeedback } from '../shared/models/newsfeedfeedback.model';
import { Projectfile } from '../shared/models/projectfile.model';
import { RatebacksStorage } from '../shared/models/rateback';
import { FeedbackSession } from '../shared/models/feedback-session';
import { Avfeedbacklane } from '../shared/models/avfeedbacklane.model';

interface LanesObject {
  [ratingId: number]: Avfeedbacklane[];
}

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  ratebacks: RatebacksStorage = {};
  lanes: LanesObject = {};

  constructor(private http: HttpClient) {
    this.parseRatebacks();
  }

  createRatebackForFeedback(value: number, feedbackID: number) {
    const url = API_URL + 'ratebacks/';

    return this.http.post(url, {
      value,
      feedback_id: feedbackID,
    });
  }

  fetchFilesForFeedback(feedbackID: number) {
    const url = API_URL + 'projectfiles/?feedback_id=' + feedbackID;

    return this.http.get<Projectfile[]>(url);
  }

  fetchProjectResort(projectID: number, raterID: number) {
    const url =
      API_URL + `projectresorts/?project_id=${projectID}&rater_id=${raterID}`;
    return this.http.get(url);
  }

  markPaidFeedbackSessionAsPaidForRaterAndProject(
    raterID: number,
    projectID: number,
  ) {
    const url =
      API_URL +
      'paidsessionpaid?raterID=' +
      raterID +
      '&projectID=' +
      projectID;

    return this.http.put<FeedbackSession>(url, {
      paid: true,
    });
  }

  fetchPaidFeedbackSessionForRaterAndProject(
    raterID: number,
    projectID: number,
  ) {
    const url =
      API_URL + 'paidsession?raterID=' + raterID + '&projectID=' + projectID;

    return this.http.get<FeedbackSession>(url);
  }

  fetchFeedbacksForRatebackValue(ratebackvalue: number) {
    const url = API_URL + 'feedbacks/?rateback_value=' + ratebackvalue;

    return this.http.get<Feedback[]>(url);
  }

  fetchMessagesForProject(projectID: number) {
    const url = API_URL + 'messages/?project_id=' + projectID;

    return this.http.get<Message[]>(url);
  }

  fetchFeedbacksForRatebackValueAndProject(
    rateback_value: number,
    projectID: number,
  ) {
    const params = createHttpParams({
      p_id: projectID,
      rateback_value,
    });

    return this.http.get<Feedback[]>(FEEDBACKS_URL, { params });
  }

  fetchClosedRatebackSessionFeedbacksForProjectAndRater(
    project_id: number,
    rater_id: number,
  ) {
    const params = createHttpParams({
      project_id,
      rater_id,
      closed_session: 'true',
    });

    return this.http.get<NewsfeedFeedback[]>(FEEDBACKS_URL, { params });
  }

  fetchFeedbacksForProjectAndRater(projectID: number, raterID: number) {
    const params = createHttpParams({
      project_id: projectID,
      rater_id: raterID,
    });

    return this.http.get<NewsfeedFeedback[]>(FEEDBACKS_URL, { params });
  }

  fetchFunnelPositionForAdvisor(advisorID?: number) {
    const url =
      API_URL + 'funnelforadvisor?advisorID=' + (advisorID ? advisorID : '');

    return this.http.get<number>(url);
  }

  fetchFunnelPositionForStudent(studentID: number) {
    const url = API_URL + 'funnelforstudent?studentID=' + studentID;

    return this.http.get<number>(url);
  }

  fetchFunnelsForUser(userId: number) {
    const url = API_URL + 'funnels/' + userId;

    return this.http.get<Funnel>(url);
  }

  fetchRatebacksForUser(userId: number) {
    const url = API_URL + 'ratebacks/?user_id=' + userId;

    return this.http.get<[{ value: number }]>(url);
  }

  fetchRatebacksForProject(projectID: number) {
    const url = API_URL + 'ratebacks/?project_id=' + projectID;

    return this.http.get<[{ value: number }]>(url);
  }

  fetchRatebacksForProjectAndRater(projectID: number, raterID: number) {
    const url =
      API_URL + 'ratebacks/?project_id=' + projectID + '&rater_id=' + raterID;

    return this.http.get<Array<{ id: number; value: number }>>(url);
  }

  fetchFeedbacksForProject(projectID: number) {
    const url = API_URL + 'feedbacks/?project_id_only=' + projectID;

    return this.http.get<Feedback[]>(url);
  }

  fetchRatingsForProject(projectID: number) {
    const url = API_URL + 'ratings/?project_id=' + projectID;

    return this.http.get<Feedbackobject[]>(url);
  }

  fetchRatingsForProjectAndRater(projectID: number, raterID: number) {
    const url =
      API_URL + 'ratings/?project_id=' + projectID + '&rater_id=' + raterID;

    return this.http.get<Feedbackobject[]>(url);
  }

  parseRatebacks() {
    const stored = localStorage.getItem('ratebacks');
    if (stored) {
      this.ratebacks = JSON.parse(stored);
    }
  }

  storeRatebacks() {
    localStorage.setItem('ratebacks', JSON.stringify(this.ratebacks));
  }

  disconnectUser(type: string, userId: number) {
    return this.http.post(DISCONNECTED_USERS_URL, {
      disconnected_user: {
        disconnect_type: type,
        disconnect_user_id: userId,
      },
    });
  }

  public updatePaymentStatus(
    payment_id: string,
    feedbacksession_id?: number,
  ): Observable<void> {
    return this.http.put<void>(FEEDBACK_SESSIONS_STATUS_UPDATE_URL, {
      payment_id,
      feedbacksession_id,
    });
  }

  public fetchFeedbackSession(id: number): Observable<FeedbackSession> {
    return this.http.get<FeedbackSession>(FEEDBACK_SESSION_URL(id));
  }

  public editFeedbackSession(
    id: number,
    feedbacksession: Partial<FeedbackSession>,
  ) {
    return this.http.put(FEEDBACK_SESSION_URL(id), { feedbacksession });
  }
}
