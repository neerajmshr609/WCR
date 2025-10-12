import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, EMPTY, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  ADD_TO_REVIEW_QUEUE_URL,
  API_URL,
  MY_CHOOSE_THE_BEST_PROJECTS,
  PROJECTS_FEEDBACK_URL,
  PROJECTS_URL,
  PROJECT_URL,
  REMOVE_FROM_REVIEW_QUEUE_URL,
  SET_FIRST_IN_QUEUE,
} from 'src/config/config';
import { createHttpParams } from '../shared/functions/http-params';
import { Artcategory } from '../shared/models/artcategory.model';
import { Category } from '../shared/models/category.model';
import { PresenterQuestionAnswer } from '../shared/models/presenter-question-answer.model';
import { Project } from '../shared/models/project.model';
import { Projectadvisor } from '../shared/models/Projectadvisor.model';
import { AVRatingParamExample } from '../shared/models/av-rating-param-example';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { Message } from '../shared/models/message.model';
import { Point } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public avRatingParamsExamplesLoading: boolean;
  public avRatingParamsExamples: AVRatingParamExample[];

  constructor(
    private http: HttpClient,
    private conversationsService: ConversationsService,
    private messagesService: MessagesService,
  ) {
    this.getAVRatingParamsExamples();
  }

  public fetchArtcategory(id: number) {
    const url = API_URL + 'artcategories/' + id;
    return this.http.get<Artcategory>(url);
  }

  private createProjectAdviser(projectID: number, adviserID: number) {
    const url = API_URL + 'projectadvisors/';

    return this.http.post<Projectadvisor>(url, {
      projectadvisor: {
        project_id: projectID,
        myadviser_id: adviserID,
      },
    });
  }

  private deleteProjectAdviser(adviserID: number) {
    const url = API_URL + 'projectadvisors/' + adviserID;
    return this.http.delete<Projectadvisor>(url);
  }

  public updateProjectAdvisors(
    project: Project,
    currentAdvisors: Projectadvisor[],
  ) {
    const deleteCalls = [of<{} | null>()];
    const createCalls = [of<{} | null>()];

    project.projectadvisors?.forEach((adv) => {
      if (!adv.id) {
        const call = this.createProjectAdviser(
          project.id,
          adv.myadviser_id,
        ).pipe(
          mergeMap((res) =>
            this.conversationsService.createConversation(
              project.user.id,
              res.adviser_user_id,
              res.project_id,
              null,
            ),
          ),
          mergeMap((res) =>
            this.messagesService.createMessage({
              conversation_id: res.id,
              user_id: project.user.id,
              body: project.sharetoken,
              audio_message: null,
              special: 'paid_feedback_request',
            }),
          ),
        );
        createCalls.push(call);
      }
    });

    currentAdvisors.forEach((adv) => {
      if (!project.projectadvisors.includes(adv)) {
        const call = this.deleteProjectAdviser(adv.id);
        deleteCalls.push(call);
      }
    });

    return forkJoin([...deleteCalls, ...createCalls]);
  }

  public addProject(project: Project): any {
    return this.http.post<Project>(PROJECTS_URL, {
      project: {
        ...project,
        invites_attributes: project.invites,
        presenterquestions_attributes: project.presenterquestions,
        projectfiles_attributes: project.projectfiles,
      },
    });
  }

  public updateProject(project: Project) {
    return this.http.put<Project>(PROJECT_URL(project.id), {
      project: {
        ...project,
        invites_attributes: project.invites,
        projectfiles_attributes: project.projectfiles,
        presenterquestions_attributes: project.presenterquestions,
        private: project.private,
      },
    });
  }

  public deleteProject(projectID: number) {
    return this.http.delete(PROJECT_URL(projectID));
  }

  public deleteProjectfile(projectfileID: number) {
    const url = API_URL + 'projectfiles/' + projectfileID;
    return this.http.delete(url);
  }

  public fetchArtcategories() {
    const url = API_URL + 'artcategories?flat=true';

    return this.http.get<Artcategory[]>(url);
  }

  public fetchCategories() {
    const url = API_URL + 'categories';

    return this.http.get<Category[]>(url);
  }

  public fetchProject(id: number, param?: string) {
    let params;
    if (param != null) {
      params = createHttpParams({ [param]: true });
    }
    return this.http.get<Project>(PROJECT_URL(id), { params });
  }

  public fetchProjectForProjectfileID(projectfileID: number) {
    const params = createHttpParams({ projectfileID });
    return this.http.get<Project>(PROJECTS_URL, { params });
  }

  public fetchPublicProject(sharetoken: string) {
    const params = createHttpParams({ sharetoken });
    return this.http.get<Project>(PROJECTS_URL, { params });
  }

  public fetchProjectForFeedback(feedback_id: number) {
    const params = createHttpParams({ feedback_id });
    return this.http.get<Project>(PROJECTS_FEEDBACK_URL, { params });
  }

  public fetchCreativesProjects(
    sort: string,
    page: number,
    categories?: number[],
    mediatypes?: string[],
    coordinates?: Point,
  ) {
    let param;
    switch (sort) {
      case 'reviewqueue':
        param = 'reviewqueue';
        break;
      case 'drafts':
        param = 'drafts';
        break;
      default:
        param = 'getpaid';
        break;
    }
    const params = createHttpParams({
      [param]: true,
      page,
      ...(param === 'getpaid' && sort && { sort }),
      ...(mediatypes?.length && { mediatypes: mediatypes.join('|') }),
      ...(categories?.length && { categories }),
      ...(coordinates && { x: coordinates.x, y: coordinates.y }),
    });

    return this.http.get<{
      total_count: number;
      feedback_requests_count: number;
      data: Project[];
    }>(PROJECTS_URL, { params });
  }

  public addProjectToCurrentUserReviewQueue(projectID: number) {
    return this.http.post<Projectadvisor>(ADD_TO_REVIEW_QUEUE_URL, {
      project_id: projectID,
    });
  }

  public removeProjectFromCurrentUserReviewQueue(projectID: number) {
    return this.http.post(REMOVE_FROM_REVIEW_QUEUE_URL, {
      project_id: projectID,
    });
  }

  public fetchPublicProjectsForUserID(userID: number) {
    const params = createHttpParams({ userID });
    return this.http.get<Project[]>(PROJECTS_URL, { params });
  }

  public fetchProjects() {
    return this.http.get<Project[]>(PROJECTS_URL);
  }

  public fetchCTBProjects() {
    return this.http.get<Project[]>(MY_CHOOSE_THE_BEST_PROJECTS);
  }

  public fetchPQAnswers(userId: number) {
    const url = API_URL + 'presenterquestionanswers?userID=' + userId;

    return this.http.get<PresenterQuestionAnswer[]>(url);
  }

  public updatePQAnswer(id: number, body: Partial<PresenterQuestionAnswer>) {
    const url = API_URL + 'presenterquestionanswers/' + id + '/';

    return this.http.put<PresenterQuestionAnswer>(url, { ...body });
  }

  private getYoutubeVideoId(url: string): string {
    let id: Array<string>;
    const formattedUrl = url
      .replace(/(>|<)/gi, '')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (formattedUrl[2]) {
      id = formattedUrl[2].split(/[^0-9a-z_\-]/i);
      return id[0];
    }

    return null;
  }

  public getYoutubeVideoInfo(url: string) {
    const videoId = this.getYoutubeVideoId(url);

    if (!videoId) {
      return EMPTY;
    }

    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const ytApiKey = 'AIzaSyDV_W3tsEzzpJvUjj_Qo2r4qXNmDm7cwCk';
    const params = {
      id: videoId,
      key: ytApiKey,
      fields: 'items(id, snippet(title, thumbnails), contentDetails(duration))',
      part: 'snippet, contentDetails',
    };

    return this.http
      .get(apiUrl, { params })
      .pipe(map((res: { items: Array<any> }) => res.items[0]));
  }

  public getFileSizes(handle: string) {
    return this.http.get<{ height: number; width: number }>(
      'https://cdn.filestackcontent.com/imagesize/' + handle,
    );
  }

  public getImage(url: string) {
    return this.http.get(url);
  }

  public checkDummy(url: string) {
    return this.http.get(url);
  }

  public setFirstInQueue(projectID: number) {
    return this.http.post(SET_FIRST_IN_QUEUE, {
      project_id: projectID,
    });
  }

  public getAVRatingParamsExamples() {
    this.avRatingParamsExamplesLoading = true;
    this.avRatingParamsExamples = [
      { type: 'audio', body: 'boring < > thrilling' },
      { type: 'audio', body: 'lyrics' },
      { type: 'audio', body: 'banal < > witty' },
      { type: 'audio', body: 'flat < bassline > punchy' },
      { type: 'audio', body: 'uninspired < lyrics > original' },
      { type: 'audio', body: 'unclear < bassline > groovy' },
      { type: 'audio', body: 'good catchy refrain / hook moment' },
      { type: 'audio', body: 'memorable moments' },
      { type: 'audio', body: 'balance harmony / disharmony' },
      { type: 'audio', body: 'repetitive < > interesting' },
      { type: 'audio', body: 'unoriginal < > surprising' },
      { type: 'audio', body: 'low < wanna cry moments > high' },
      { type: 'audio', body: 'unbalanced < > balanced' },
      { type: 'audio', body: 'too weak < punch > too compressed' },
      { type: 'audio', body: 'too silent < volume > too loud' },
      { type: 'audio', body: 'Low-end < too much > high-end' },
      { type: 'audio', body: 'mastering' },

      { type: 'video', body: 'boring < story > thrilling' },
      { type: 'video', body: 'banal idea < > witty ideas' },
      { type: 'video', body: 'nothing new < > pretty unique' },
      { type: 'video', body: 'unfitting < camera > good choice' },
      { type: 'video', body: 'over acting < > really believable' },
      { type: 'video', body: 'poor < acting > excellent' },
      { type: 'video', body: 'clarity of story' },
      { type: 'video', body: 'uninspired --- okay --- original' },
      { type: 'video', body: 'good content hook moment' },
      { type: 'video', body: 'memorable moments' },
      { type: 'video', body: 'too slow < good speed > too fast' },
      { type: 'video', body: 'repetitive < > interesting' },
      { type: 'video', body: 'obvious < > surprising' },
      { type: 'video', body: 'low < wanna cry moments > high' },
      { type: 'video', body: 'mastering audio' },
      { type: 'video', body: 'sound + image interaction' },
      { type: 'video', body: 'editing rhythm' },
      { type: 'video', body: 'no suspense < > totally hooked' },
    ];
    this.avRatingParamsExamplesLoading = false;
  }
}
