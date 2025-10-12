import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation, createConversation } from 'src/app/shared/models/conversation.model';
import { Funnel } from 'src/app/shared/models/funnel.model';
import { Project } from 'src/app/shared/models/project.model';
import { ConversationsServicesModule } from './conversations-services.module';
import { createHttpParams } from 'src/app/shared/functions/http-params';
import {
  CONVERSATIONS_URL,
  MY_PROJECTS,
  FUNNEL_FOR_ADVISOR_URL,
  FUNNEL_FOR_STUDENT_URL,
  FEEDBACK_ACTIVITY_URL,
  REVIEWS_URL,
  FUNNEL_URL,
  MY_USERS,
  USER_STAT_ADVISORS,
  USER_STAT_STUDENTS,
  FILTERED_CONVERSATIONS_URL,
} from 'src/config/config';
import {
  AdvisorStats,
  StudentStats,
  UserForStats,
} from 'src/app/shared/models/conversations.model';
import { Review } from 'src/app/shared/models/review';

@Injectable({
  providedIn: ConversationsServicesModule,
})
export class ConversationsService {
  userFunnelColors$ = new BehaviorSubject<Funnel>(null);

  constructor(private http: HttpClient) {
  }

  fetchFunnelsForUser(userId: number): Observable<void> {
    return this.http
      .get<Funnel>(FUNNEL_URL(userId))
      .pipe(map((res) => this.userFunnelColors$.next(res)));
  }

  fetchUserReviews() {
    return this.http.get<Review[]>(REVIEWS_URL);
  }

  fetchConversations(page: number = 0, user_id?: number, filters = {}) {
    const body = {
      page,
      ...(user_id && { user_id }),
      ...(user_id === undefined && { scheduled_calls: true }),
      filters,
    };

    return this.http.post<{ total_count: number; data: Conversation[] }>(
      FILTERED_CONVERSATIONS_URL,
      body,
    ).pipe(map((res) => {
      return { ...res, data: res.data.map(createConversation) };
    }));
  }

  fetchFeedbackActivity(
    type: string,
    page: number = 0,
    user_id?: number,
    funnel_type?: string,
  ) {
    const params = createHttpParams({ type, page, user_id, funnel_type });

    return this.http.get<{ total_count: number; data: Conversation[] }>(
      FEEDBACK_ACTIVITY_URL,
      { params },
    );
  }

  fetchFunnelPositionForAdvisor(advisorID: number): Observable<number> {
    const params = createHttpParams({ advisorID });
    return this.http.get<number>(FUNNEL_FOR_ADVISOR_URL, { params });
  }

  fetchFunnelPositionForStudent(studentID: number): Observable<number> {
    const params = createHttpParams({ studentID });
    return this.http.get<number>(FUNNEL_FOR_STUDENT_URL, { params });
  }

  fetchProject(projectId: number): Observable<Array<Project>> {
    const params = createHttpParams({ projectId });
    return this.http.get<Array<Project>>(MY_PROJECTS, { params });
  }

  fetchUsers(type: string): Observable<UserForStats[]> {
    return this.http.get<UserForStats[]>(MY_USERS(type));
  }

  fetchUserStatsAsAdvisor(
    student_id: number,
    funnel: string,
  ): Observable<StudentStats> {
    const params = createHttpParams({
      student_id,
      funnel,
    });

    return this.http.get<StudentStats>(USER_STAT_ADVISORS, { params });
  }

  fetchUserStatsAsStudent(
    advisor_id: number,
    funnel: string,
  ): Observable<AdvisorStats> {
    const params = createHttpParams({
      advisor_id,
      funnel,
    });

    return this.http.get<AdvisorStats>(USER_STAT_STUDENTS, { params });
  }

  fetchCurrerntAdvisorStats(): Observable<AdvisorStats> {
    return this.http.get<AdvisorStats>(USER_STAT_ADVISORS);
  }

  fetchCurrerntStudentStats(): Observable<StudentStats> {
    return this.http.get<StudentStats>(USER_STAT_STUDENTS);
  }
}
