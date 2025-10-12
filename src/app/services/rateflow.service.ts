import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import {
  forkJoin,
  Observable,
  BehaviorSubject,
  of,
  Subject,
  ReplaySubject,
} from 'rxjs';
import {
  ANON_USER_ID,
  API_URL,
  DEANON_FEEDBACK_URL,
  FEEDBACK_DRAFTS_URL,
  FEEDBACK_DRAFT_URL,
  FEEDBACK_SESSIONS_URL,
  PROJECTS_URL,
  RATINGS_URL,
} from 'src/config/config';
import { avFileStateEnum, avYTStateEnum } from '../shared/enums';
import { Avfeedbacklane } from '../shared/models/avfeedbacklane.model';
import { AVRatingParam } from '../shared/models/avratingparam.model';
import { Avtimelevel } from '../shared/models/avtimelevel.model';
import { Curve } from '../shared/models/curve';
import { Feedback } from '../shared/models/feedback.model';
import { Feedbackobject } from '../shared/models/feedbackobject.model';
import { PresenterQuestionAnswer } from '../shared/models/presenter-question-answer.model';
import { Project } from '../shared/models/project.model';
import { Projectfile } from '../shared/models/projectfile.model';
import { Rating } from '../shared/models/rating.model';
import { FeedbackSession } from '../shared/models/feedback-session';
import { Draft } from '../shared/models/draft';
import { createHttpParams } from '../shared/functions/http-params';

interface AudioRecordingState {
  type: string;
  order?: number;
  tab?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RateflowService {
  public didAddNewAVFeedback$ = new BehaviorSubject<boolean>(null);
  public trackpositionUpdated$ = new BehaviorSubject<number>(null);
  public avSliderDidSlide$ = new Subject<{
    fileID: string;
    param: AVRatingParam;
    value: number;
  }>();

  public avFilePlaybackClickChange$ = new BehaviorSubject<{
    state: avFileStateEnum | avYTStateEnum;
    fileIDString: string;
  }>(null);
  public avFileStateChange$ = new BehaviorSubject<{
    state: avFileStateEnum | avYTStateEnum;
    fileIDString: string;
  }>(null);

  public currentProject: Project;
  public initialOrder: Projectfile[];
  public newOrder = new BehaviorSubject<Projectfile[]>(null);
  public drawing = new BehaviorSubject<any>(null);
  public clearDrawingListEvt = new EventEmitter<boolean>();

  private _audioRecordingStarted$ = new BehaviorSubject<AudioRecordingState>(
    null,
  );

  public state: {
    currentAVLanes: Avfeedbacklane[];
    currentProjectFeedbacks: Feedbackobject;
    currentInfoFeedbacks: Feedbackobject;
    currentFilesFeedbacks: Feedbackobject[];
  };

  playingModeChange = new EventEmitter<boolean>();
  avParamChange = new ReplaySubject<AVRatingParam>(3);
  avParamChange$ = this.avParamChange.asObservable();
  selectParam = new EventEmitter<number>();

  feedbackObjectDelete = new EventEmitter<Feedback>();
  curves: {
    [key: string]: Curve[];
  };

  public draftParsed$ = new BehaviorSubject<boolean>(false);
  public draftTimerParsed$ = new BehaviorSubject<number>(null);
  public draftsFetched$ = new BehaviorSubject<boolean>(false);
  public fetchedDrafts = new Array<Draft>();

  public get audioRecordingStarted$(): Observable<AudioRecordingState> {
    return this._audioRecordingStarted$.pipe(shareReplay(1));
  }

  public set audioRecordingStarted(value: AudioRecordingState) {
    this._audioRecordingStarted$.next(value);
  }

  constructor(private http: HttpClient) {
    this.reinitState();
  }

  public reinitState() {
    this.state = {
      currentAVLanes: [],
      currentProjectFeedbacks: null,
      currentInfoFeedbacks: null,
      currentFilesFeedbacks: [],
    };
  }

  public resortIsWithoutComment() {
    if (this.newOrder.value?.length && !this.resortIsTheSame()) {
      const feedbacks = this.state.currentProjectFeedbacks.feedbacks;
      if (
        !feedbacks?.filter(
          (obj) =>
            obj.feedbacktype === 'resortItems' &&
            (obj.text || obj.audio_message?.url),
        ).length
      ) {
        return true;
      }
    }

    return false;
  }

  public resortIsTheSame() {
    let theSame = true;
    const files = this.newOrder.value;
    this.initialOrder.some((file, index) => {
      if (file.id !== files[index]?.id) {
        theSame = false;

        return true;
      }
    });

    return theSame;
  }

  public isEmpty(): boolean {
    const noInfo = this.state.currentInfoFeedbacks == null;
    const noFiles = this.state.currentFilesFeedbacks.length === 0;
    const noProject = this.state.currentProjectFeedbacks == null;

    return noInfo && noFiles && noProject;
  }

  public updateProjectFeedback(feedback: Feedbackobject) {
    this.state.currentProjectFeedbacks = feedback;
  }

  public getProjectFeedback() {
    return this.state.currentProjectFeedbacks;
  }

  public fetchPresenterquestionAnswersForProjectAndUser(
    projectID: number,
    userId: number,
  ) {
    const url =
      API_URL +
      'presenterquestionanswersforrateflowproject?project_id=' +
      projectID +
      '&user_id=' +
      userId;

    return this.http.get<PresenterQuestionAnswer[]>(url);
  }

  public addPresenterquestionAnswer(
    presenterquestionanswer: PresenterQuestionAnswer,
  ) {
    const url = API_URL + 'presenterquestionanswers';

    return this.http.post<PresenterQuestionAnswer>(url, {
      presenterquestionanswer,
    });
  }

  public deletePresenterquestionAnswer(
    presenterquestionanswer: PresenterQuestionAnswer,
  ) {
    const url =
      API_URL + 'presenterquestionanswers/' + presenterquestionanswer.id;

    return this.http.delete<PresenterQuestionAnswer>(url);
  }

  public addAdviserToFavorites(adviserid: number, user_id: number) {
    const url = API_URL + 'myadvisers';

    return this.http.post(url, {
      myadviser: {
        user_id,
        adviserid,
      },
    });
  }

  public removeAdviserFromFavorites(adviserid: number, user_id: number) {
    const url = API_URL + 'removemyadviser';

    return this.http.post(url, {
      myadviser: {
        user_id,
        adviserid,
      },
    });
  }

  public createSkipSetting(
    project_id: number,
    user_id: number,
    skiptime: string,
    skipCategoryID?: number,
    skipParentcategoryID?: number,
  ) {
    const url = API_URL + 'skips';

    return this.http.post(url, {
      skip: {
        user_id,
        project_id,
        artcategory_id: skipCategoryID,
        parentartcategory_id: skipParentcategoryID,
        skiptime,
      },
    });
  }

  public createProjectfeedbackForProject(project: Project) {
    this.currentProject = project;

    const feedbackObj = new Feedbackobject('project', []);
    feedbackObj.display_name = 'the project';
    this.state.currentProjectFeedbacks = feedbackObj;

    return feedbackObj;
  }

  public updateCurrentInfoFeedback(feedback?: Feedbackobject) {
    let newObj: Feedbackobject;

    if (feedback) {
      this.state.currentInfoFeedbacks = feedback;
      newObj = feedback;
    } else {
      const existingObj = this.state.currentInfoFeedbacks;

      if (existingObj) {
        newObj = existingObj;
      } else {
        const feedbackObj = new Feedbackobject('info', []);
        feedbackObj.display_name = 'the concept';
        this.state.currentInfoFeedbacks = feedbackObj;
        newObj = feedbackObj;
      }
    }

    return newObj;
  }

  public updateFilesFeedbackForFile(
    file?: Projectfile,
    feedback?: Feedbackobject,
  ) {
    let newObj: Feedbackobject;

    if (feedback) {
      const updatedArray = this.state.currentFilesFeedbacks.filter(
        (element) => element.fileId !== feedback.fileId,
      );
      updatedArray.push(feedback);
      this.state.currentFilesFeedbacks = updatedArray;

      newObj = feedback;
    } else {
      const existingObj = this.state.currentFilesFeedbacks.find(
        (element: Feedbackobject) => element.fileId === file.id,
      );

      if (existingObj) {
        newObj = existingObj;
      } else {
        const feedbackObj = new Feedbackobject('files', [], file.id);

        feedbackObj.display_name =
          file.kind +
          ' ' +
          (this.currentProject.projectfiles.indexOf(file) + 1);
        if (file.kind === 'hostedvideo') {
          feedbackObj.display_name =
            'video ' + (this.currentProject.projectfiles.indexOf(file) + 1);
        }

        this.state.currentFilesFeedbacks.push(feedbackObj);
        newObj = feedbackObj;
      }
    }

    return newObj;
  }

  public fetchNextProject() {
    const url = PROJECTS_URL + '?next=true';

    return this.http.get<Project>(url);
  }

  public saveAllDataForPublicReview(project: Project): Observable<any[]> {
    return this.saveAllData(project, ANON_USER_ID, false);
  }

  private parseCurves(): void {
    for (const key in this.curves) {
      if (Object.prototype.hasOwnProperty.call(this.curves, key)) {
        const avFeedbackLanes: Avfeedbacklane[] = [];
        const curves = this.curves[key];

        for (const curve of curves) {
          const lane = new Avfeedbacklane();
          lane.projectfile_id = curve.fileId;
          lane.avratingparam_id = curve.avParamId;

          const ratingRecors = curve.ratingRecords;
          const timeLevels: Avtimelevel[] = [];

          for (const record of ratingRecors) {
            const timeLevel = new Avtimelevel();
            timeLevel.level = record.level;
            timeLevel.timeposition = record.tick;
            timeLevel.command = record.type;
            timeLevel.avfeedbacklane_id = lane.id;

            timeLevels.push(timeLevel);
          }
          lane.avtimelevels = timeLevels;

          avFeedbackLanes.push(lane);
        }

        this.updateAVLanesForFile(avFeedbackLanes, +key);
      }
    }
  }

  private updateAVLanesForFile(lanes: Avfeedbacklane[], fileId: number) {
    let newLanes = [];

    for (const savedLane of this.state.currentAVLanes) {
      if (savedLane.projectfile_id !== fileId) {
        newLanes.push(savedLane);
      }
    }

    newLanes = newLanes.concat(lanes);
    this.state.currentAVLanes = newLanes;
  }

  public saveAllData(
    project: Project,
    userId: number,
    is_paid_session: boolean,
    seconds?: number,
    billable_seconds?: number,
  ): Observable<any[]> {
    this.parseCurves();

    let session;
    return this.createFeedbackSession(
      project.id,
      is_paid_session,
      seconds,
      billable_seconds,
    ).pipe(
      mergeMap((feedbackSession: FeedbackSession) => {
        session = feedbackSession;
        const networkCalls = [];

        const projectLevelFeedbackCall = this.createRating(
          feedbackSession.id,
          'project',
          project,
          userId,
        );

        if (projectLevelFeedbackCall) {
          networkCalls.push(projectLevelFeedbackCall);
        }

        const projectInfoLevelFeedback = this.createRating(
          feedbackSession.id,
          'info',
          project,
          userId,
        );

        if (projectInfoLevelFeedback) {
          networkCalls.push(projectInfoLevelFeedback);
        }

        networkCalls.push(this.createResort(project, userId));

        for (const fileLevelEntry of this.state.currentFilesFeedbacks) {
          let fileLevelFeedbackCall = of<null | {}>(null);

          const fileObj = project.projectfiles.find(
            (model) => model.id === fileLevelEntry.fileId,
          );
          const lanes = this.state.currentAVLanes?.filter(
            (lane) => +lane.projectfile_id === +fileObj.id,
          );

          if (this.state.currentAVLanes?.length && lanes?.length) {
            fileLevelFeedbackCall = this.createRating(
              feedbackSession.id,
              'files',
              project,
              userId,
              fileLevelEntry.fileId,
              lanes,
            );
          } else {
            fileLevelFeedbackCall = this.createRating(
              feedbackSession.id,
              'files',
              project,
              userId,
              fileLevelEntry.fileId,
            );
          }

          networkCalls.push(fileLevelFeedbackCall);
        }

        return forkJoin(networkCalls);
      }),
      map(() => session.id),
    );
  }

  private createFeedbackSession(
    project_id: number,
    is_paid_session: boolean,
    seconds?: number,
    billable_seconds?: number,
  ) {
    const feedbacksession = {
      project_id,
      ...(is_paid_session && !!billable_seconds && { billable_seconds }),
      ...(is_paid_session && { seconds }),
      seconds,
      is_paid_session,
    };

    return this.http.post(
      FEEDBACK_SESSIONS_URL,
      { feedbacksession },
      { headers: { 'user-anon': ANON_USER_ID.toString() } },
    );
  }

  private serializeLanesAVRating(fileID: string, lanes: Avfeedbacklane[]) {
    if (!lanes) {
      return [];
    }

    const serializedLanes = [];

    lanes.forEach((lane) => {
      const ln = {
        avratingparam_id: lane.avratingparam_id,
        projectfile_id: fileID,
        avtimelevels_attributes: this.serializeTimeLevelsAVRating(
          lane.avtimelevels,
        ),
      };

      serializedLanes.push(ln);
    });

    return serializedLanes;
  }

  private serializeTimeLevelsAVRating(timelevels: Avtimelevel[]) {
    if (!timelevels) {
      return [];
    }

    const serializedLevels = [];

    timelevels.forEach((level) => {
      const lev = {
        timeposition: level.timeposition,
        level: level.level,
        order: level.order,
        command: level.command,
      };
      serializedLevels.push(lev);
    });

    return serializedLevels;
  }

  private serializeFeedbacks(feedbacks: Feedback[], singleFeedback = false) {
    if (!feedbacks) {
      return [];
    }

    const serializedFeedbacks = [];

    feedbacks.forEach((feedback) => {
      serializedFeedbacks.push({
        link: feedback.link,
        text: feedback.text,
        ...(feedback.audio_message && {
          audio_message: {
            duration: feedback.audio_message.duration,
            url: feedback.audio_message.url,
            language: feedback.audio_message.language,
          },
        }),
        drawing: feedback.drawing,
        order: feedback.order,
        screenshot: feedback.screenshot,
        feedbacktype: feedback.feedbacktype,
        avratingparam_id: feedback.avratingparam_id,
        avtracktimeposition: feedback.avtracktimeposition,
      });
    });

    if (singleFeedback) {
      return serializedFeedbacks[0];
    }

    return serializedFeedbacks;
  }

  private createRating(
    feedbacksession_id: number,
    ratingtype: string,
    project: Project,
    user_id: number,
    fileId?: string,
    lanes?: Avfeedbacklane[],
  ) {
    const rating: Rating = {
      feedbacksession_id,
      project_id: project.id,
      user_id,
      ratingtype,
      categoryrelation_id: project.relation_id,
    };

    if (ratingtype === 'project' && this.state.currentProjectFeedbacks) {
      let projectLevelFeedback;

      if (this.state.currentProjectFeedbacks.feedbacks) {
        projectLevelFeedback = this.serializeFeedbacks(
          this.state.currentProjectFeedbacks.feedbacks.filter((obj) => {
            return obj.text || obj.audio_message?.url;
          }),
        );
      }

      rating.feedbacks_attributes = projectLevelFeedback;
      rating.slidervalue = this.state.currentProjectFeedbacks.slidervalue;
    }

    if (ratingtype === 'info' && this.state.currentInfoFeedbacks) {
      let projectInfoLevelFeedback;

      if (this.state.currentInfoFeedbacks.feedbacks) {
        projectInfoLevelFeedback = this.serializeFeedbacks(
          this.state.currentInfoFeedbacks.feedbacks.filter((obj) => {
            return obj.text || obj.audio_message?.url;
          }),
        );
      }

      rating.feedbacks_attributes = projectInfoLevelFeedback;
      rating.slidervalue = this.state.currentInfoFeedbacks.slidervalue;
    }

    if (ratingtype === 'files' && this.state.currentFilesFeedbacks) {
      let projectFileLevelFeedback;

      if (this.state.currentFilesFeedbacks) {
        projectFileLevelFeedback = this.state.currentFilesFeedbacks.find(
          (feedback) => feedback.fileId === fileId,
        );
      }

      let projectFileLevelFeedbacks;
      if (projectFileLevelFeedback.feedbacks) {
        projectFileLevelFeedbacks = projectFileLevelFeedback.feedbacks.filter(
          (obj) => {
            return obj.text || obj.audio_message?.url;
          },
        );
      }

      if (lanes) {
        rating.avfeedbacklanes_attributes = this.serializeLanesAVRating(
          fileId,
          lanes,
        );
      }

      rating.projectfile_id = fileId;
      rating.feedbacks_attributes = this.serializeFeedbacks(
        projectFileLevelFeedbacks,
      );
      rating.slidervalue = projectFileLevelFeedback.slidervalue;
    }

    return this.http.post(
      RATINGS_URL,
      { rating },
      { headers: { 'user-anon': ANON_USER_ID.toString() } },
    );
  }

  public colorFromString(name: string) {
    switch (name) {
      case 'green':
        return '#15E798';

      case 'blue':
        return '#0051FF';

      case 'mustard':
        return '#FFC300';

      case 'red':
        return '#D9593C';

      default:
        throw new Error('Invalid color name');
    }
  }

  public createResort(project: Project, user_id: number) {
    if (!this.newOrder.value || this.resortIsTheSame()) {
      return of(null);
    }

    const url = API_URL + 'projectresorts';
    const resortimagesAttributes = [];
    for (const image of this.newOrder.value) {
      const resortimage = {
        projectfile_id: +image.id,
        order: image.order,
      };
      resortimagesAttributes.push(resortimage);
    }

    const feedbacks = this.state.currentProjectFeedbacks.feedbacks;
    const comment = feedbacks.filter(
      (obj) =>
        obj.feedbacktype === 'resortItems' &&
        (obj.text || obj.audio_message?.url),
    )[0];

    const body = {
      user_id,
      project_id: project.id,
      comment: comment.text,
      audio_message: comment.audio_message,
      resortimages_attributes: resortimagesAttributes,
    };

    return this.http.post(url, body).pipe(tap(() => this.newOrder.next(null)));
  }

  public deanonFeedback(feedbackSessionId) {
    return this.http.put(DEANON_FEEDBACK_URL, {
      feedbacksession_id: feedbackSessionId,
    });
  }

  private getDraftObject(projectId: number): Draft {
    this.parseCurves();

    const projectFeedbacks = this.state.currentProjectFeedbacks;
    const infoFeedbacks = this.state.currentInfoFeedbacks;
    const fileFeedbacks = this.state.currentFilesFeedbacks;

    const getResort = () => {
      if (!this.newOrder.value || this.resortIsTheSame()) {
        return;
      }
      return this.newOrder.value.map((file) => +file.id);
    };

    const getSliderValues = () => {
      return [
        { projectfile_id: 0, slidervalue: projectFeedbacks?.slidervalue },
        { projectfile_id: -1, slidervalue: infoFeedbacks?.slidervalue },
        ...fileFeedbacks?.map((feedback) => ({
          projectfile_id: +feedback.fileId,
          slidervalue: feedback.slidervalue,
        })),
      ];
    };

    const getFeedbacks = (feedbacks, projectfile_id?) => {
      if (feedbacks?.length) {
        return feedbacks.map((feedback) => ({
          projectfile_id,
          face_uid: feedback.face_uid,
          ...this.serializeFeedbacks([feedback], true),
        }));
      }

      return [];
    };

    const getAllFeedbacks = () => {
      return [
        ...getFeedbacks(projectFeedbacks?.feedbacks, 0),
        ...getFeedbacks(infoFeedbacks?.feedbacks, -1),
        ...fileFeedbacks
          .map((feedback) => getFeedbacks(feedback.feedbacks, +feedback.fileId))
          .flat(),
      ];
    };

    return {
      project_id: projectId,
      resort: getResort(),
      slidervalues: getSliderValues(),
      curves: this.state.currentAVLanes,
      feedbacks: getAllFeedbacks(),
    };
  }

  private draftHasData(draft: Draft) {
    if (!draft) {
      return false;
    }
    const hasCurves = draft.curves?.some((curve) => curve.avtimelevels?.length);
    const hasSlidervalues = draft.slidervalues?.some(
      (value) => typeof value.slidervalue === 'number',
    );
    return (
      hasCurves ||
      hasSlidervalues ||
      !!draft.feedbacks?.length ||
      !!draft.resort?.length ||
      !!draft.timer
    );
  }

  public saveDraftLocal(projectId: number, seconds: number) {
    const data = this.getDraftObject(projectId);
    const local = localStorage.getItem('feedbackDrafts');
    const drafts = local ? JSON.parse(local) : {};
    if (!this.draftHasData(data) && !this.draftHasData(drafts[projectId])) {
      return;
    }

    data.timer = seconds;
    drafts[projectId] = data;
    localStorage.setItem('feedbackDrafts', JSON.stringify(drafts));
  }

  public saveDraftServer(projectId: number, seconds: number) {
    const data = this.getDraftObject(projectId);
    data.timer = seconds;
    return this.draftHasData(data)
      ? this.http.post(FEEDBACK_DRAFTS_URL, data)
      : of(null);
  }

  public getDrafts() {
    return this.http.get(FEEDBACK_DRAFTS_URL).pipe(
      tap((res: Draft[]) => {
        this.fetchedDrafts = res;
        this.draftsFetched$.next(true);
      }),
    );
  }

  public getDraftByProject(project_id: number) {
    const params = createHttpParams({ project_id });
    return this.http.get(FEEDBACK_DRAFTS_URL, { params });
  }

  public deleteDraft(id: number, projectId: number) {
    const local = localStorage.getItem('feedbackDrafts');
    const drafts = local ? JSON.parse(local) : {};
    delete drafts[projectId];
    localStorage.setItem('feedbackDrafts', JSON.stringify(drafts));
    return this.http.delete(FEEDBACK_DRAFT_URL(id));
  }

  public parseDraft(draft: Draft, project: Project) {
    if (!this.draftHasData(draft)) {
      return;
    }

    const slidervalueProject = draft.slidervalues.find(
      (value) => value.projectfile_id === 0,
    );
    const slidervalueInfo = draft.slidervalues.find(
      (value) => value.projectfile_id === -1,
    );

    this.state = {
      currentAVLanes: draft.curves
        .filter((curve) => curve.avratingparam_id)
        .map((curve) => {
          const file = project.projectfiles.find(
            (f) => +f.id === curve.projectfile_id,
          );
          const param = file.avratingparams.find(
            (p) => p.id === curve.avratingparam_id,
          );
          return {
            ...curve,
            color: param.color,
            name: param.name,
          };
        }),
      currentProjectFeedbacks: {
        ratingtype: 'project',
        feedbacks: draft.feedbacks.filter(
          (feedback) => feedback.projectfile_id === 0,
        ),
        slidervalue: slidervalueProject?.slidervalue,
        sliderdragged: typeof slidervalueProject?.slidervalue === 'number',
      },
      currentInfoFeedbacks: {
        ratingtype: 'info',
        feedbacks: draft.feedbacks.filter(
          (feedback) => feedback.projectfile_id === -1,
        ),
        slidervalue: slidervalueInfo?.slidervalue,
        sliderdragged: typeof slidervalueInfo?.slidervalue === 'number',
      },
      currentFilesFeedbacks: Array.from(
        new Set(
          draft.feedbacks
            .filter((feedback) => ![0, -1].includes(feedback.projectfile_id))
            .map((feedback) => {
              return feedback.projectfile_id;
            }),
        ),
      ).map((id) => {
        const object: Feedbackobject = {
          ratingtype: 'files',
          feedbacks: draft.feedbacks
            .filter((f) => f.projectfile_id === id)
            .map((feedback) => {
              if (!feedback.avratingparam_id) {
                return feedback;
              }
              const file = project.projectfiles.find(
                (f) => +f.id === feedback.projectfile_id,
              );
              const param = file.avratingparams.find(
                (p) => p.id === feedback.avratingparam_id,
              );
              return {
                ...feedback,
                local_avratingparam: {
                  color: param.color,
                  name: param.name,
                  projectfile_id: +file.id,
                },
              };
            }),
          fileId: id.toString(),
          slidervalue: draft.slidervalues.find(
            (value) => value.projectfile_id === id,
          )?.slidervalue,
        };

        return {
          ...object,
          sliderdragged: typeof object.slidervalue === 'number',
        };
      }),
    };

    const curves: Curve[] = this.state.currentAVLanes.map((curve) => ({
      avParamId: curve.avratingparam_id,
      fileId: curve.projectfile_id,
      ratingRecords: curve.avtimelevels.map((level) => ({
        type: level.command,
        tick: level.timeposition,
        level: level.level,
      })),
      color: this.colorFromString(curve.color),
      active: true,
      svgPath: null,
      lastLevel: null,
      algorithmTick: null,
    }));

    curves.forEach((curve) => {
      if (!this.curves) {
        this.curves = {};
      }

      const current = this.curves[curve.fileId.toString()] || [];
      current.push(curve);
      this.curves[curve.fileId.toString()] = current;
    });

    if (draft.resort?.length) {
      this.newOrder.next(
        draft.resort.map((item) =>
          project.projectfiles.find((file) => +file.id === item),
        ),
      );
    }

    this.draftParsed$.next(true);

    if (draft.timer) {
      this.draftTimerParsed$.next(draft.timer);
    }
  }
}
