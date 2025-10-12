import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, firstValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  ADVISOR_PROFILE_API_URLS,
  ICE_BREAKER_API_URLS,
  PROFILE_API_URLS,
  PROFILE_EMAIL_NOTIFICATION_API_URLS,
  USER_PROFILE_ORGANIZATION_MEMBER_API_URLS,
} from './profile.api-urls.provider';
import { createHttpParams } from '../../../shared/functions/http-params';
import { LoadingState } from '@helpers-lib/loading-state';
import { filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { UserProfile, userProfileFactory } from '../model/user-profile.model';
import { IUserProfileResponse } from '../model/response/user-profile-response.interface';
import { AuthService } from '../../../auth/auth.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { IAdvisorUserProfileResponse } from '../model/response/advisor-user-profile-response.interface';
import { AdvisorUserProfileMergedResponse } from '../model/response/advisor-user-profile-merge-response.interface';
import { IEmailNotificationMuteResponse } from '../model/response/email-notification-mute-response.interface';
import { emitIfAllTrue } from '@helpers-lib/rx-js.helpers';
import { OrgMemberJob } from '../model/request/org-member-job';
import { IUpdateJobTitleDescription } from '../model/response/update-job-title-description-response.interface';
import { getHostWithProtocol } from '@helpers-lib/location.helper';
import { PROFILE_PATH } from '../routing/profile.paths';
import { castToArray } from '@helpers-lib/array-helpers.lib';
import { UserProfileIceBreaker } from '../model/user-profile-ice-breaker.model';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _publicProfile$ = new BehaviorSubject<UserProfile | null>(
    null,
  );
  readonly publicProfile$ = this._publicProfile$.asObservable();
  readonly publicProfileIceBreakers$ = this.publicProfile$.pipe(
    map((_) => castToArray<UserProfileIceBreaker>(_.icebreakers)),
  );
  readonly userProfileOrgMember$ = this.publicProfile$.pipe(
    map((_) => (_?.isOrganizationMember() ? _.org_member : null)),
  );
  readonly orgMemberHasTitleOrDescription$ = this.userProfileOrgMember$.pipe(
    map((_) => !!(_?.job_title || _?.job_description)),
  );
  readonly loadingState = new LoadingState();

  readonly isProfileOwner$ = combineLatest([
    this._authService.authorizedUser$,
    this.publicProfile$,
  ]).pipe(
    map(
      ([authorizedUser, userProfile]) =>
        authorizedUser &&
        userProfile &&
        userProfile.isProfileOwner(authorizedUser),
    ),
  );

  readonly profileUrl$ = this.publicProfile$.pipe(
    map((_) => {
      const userShareToken = _?.sharetoken || null;
      return userShareToken
        ? [
            getHostWithProtocol(),
            PROFILE_PATH.toStringUrl({ profileToken: userShareToken }),
          ].join('/')
        : '';
    }),
  );

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService,
    private readonly _loggerService: LoggerService,
  ) {
    this._loggerService.subscribeDebugLog(
      'Current user profile state ',
      this.publicProfile$,
    );
  }

  private _allowProfileChanges() {
    return emitIfAllTrue(this.isProfileOwner$, this.loadingState.isNotLoading$);
  }

  private _fetchAdvisorUserProfile(user: IUserProfileResponse) {
    return this._httpClient
      .get<IAdvisorUserProfileResponse>(
        ADVISOR_PROFILE_API_URLS.GET + `/${user.id}`,
      )
      .pipe(map((_) => userProfileFactory({ ...user, ..._ })));
  }

  fetchProfile(profileToken: string) {
    this.loadingState.startLoading();
    const params = createHttpParams({ sharetoken: profileToken });
    this._httpClient
      .get<IUserProfileResponse>(PROFILE_API_URLS.GET, { params })
      .pipe(
        switchMap((_) => this._fetchAdvisorUserProfile(_)),
        finalize(() => this.loadingState.completeLoading()),
      )
      .subscribe({
        next: (userProfile) => {
          this._publicProfile$.next(userProfile);
        },
        error: (err) => {
          this._loggerService.errorWithDescription('fetching profile', err);
          this._publicProfile$.next(null);
        },
      });
  }

  reloadUserPublicProfile() {
    this.publicProfile$
      .pipe(
        take(1),
        filter((_) => _ !== null),
        tap(() => this.loadingState.startLoading()),
        finalize(() => this.loadingState.completeLoading()),
      )
      .subscribe(({ sharetoken }) => {
        this.fetchProfile(sharetoken);
      });
  }

  updateJobTitleDescription(orgMember: OrgMemberJob) {
    this._loggerService.debug('updating org member with data ', orgMember);
    const updateRequest = this.publicProfile$.pipe(
      take(1),
      switchMap((userProfile) =>
        this._httpClient
          .put<IUpdateJobTitleDescription>(
            USER_PROFILE_ORGANIZATION_MEMBER_API_URLS.PUT +
              `/${userProfile.id}`,
            orgMember,
          )
          .pipe(map((_) => userProfile.updateOrMemberInfo(_))),
      ),
      tap((_) => this._publicProfile$.next(_)),
    );

    return this._allowProfileChanges().pipe(switchMap(() => updateRequest));
  }

  recommendProfile() {
    const userIsSignedIn$ = this._authService.userIsSignedIn$.pipe(
      take(1),
      filter((_) => _),
    );

    const notLoadingAndNotProfileOwner$ = combineLatest([
      this.loadingState.isLoading$,
      this.isProfileOwner$,
    ]).pipe(
      map(([isLoading, isProfileOwner]) => !isLoading && !isProfileOwner),
      take(1),
      filter((_) => _),
    );

    const authorizedUserAndUserProfile$ = combineLatest([
      this._authService.authorizedUser$,
      this.publicProfile$,
    ]).pipe(take(1));

    userIsSignedIn$
      .pipe(
        switchMap(() => notLoadingAndNotProfileOwner$),
        switchMap(() => authorizedUserAndUserProfile$),
        switchMap(([authorizedUser, publicProfile]) => {
          this.loadingState.startLoading();
          // TODO: Make request to API
          // @ts-ignore
          const updated = {
            ...publicProfile,
            recommended_by_user_id: authorizedUser.id,
          } as AdvisorUserProfileMergedResponse;
          return of(updated);
        }),
        finalize(() => this.loadingState.completeLoading()),
        map((_) => userProfileFactory(_)),
      )
      .subscribe((userProfile) => {
        this._publicProfile$.next(userProfile);
      });
  }

  updateIsMuted(value: boolean) {
    const valueIsNotEqualToCurrentState$ = this.publicProfile$.pipe(
      take(1),
      filter((_) => _.conversations_muted !== value),
    );

    const isProfileOwner$ = this.isProfileOwner$.pipe(
      take(1),
      filter((_) => !!_),
    );

    const put$ = this._httpClient
      .put<IEmailNotificationMuteResponse>(
        PROFILE_EMAIL_NOTIFICATION_API_URLS.PUT,
        {},
      )
      .pipe(
        map((_) => _.user.conversations_muted),
        switchMap((_) =>
          this.publicProfile$.pipe(
            take(1),
            map((userProfile) => {
              userProfile.conversations_muted = _;
              return userProfile;
            }),
          ),
        ),
      );

    valueIsNotEqualToCurrentState$
      .pipe(
        switchMap(() => isProfileOwner$),
        switchMap(() => put$),
      )
      .subscribe((_) => {
        this._publicProfile$.next(_);
      });
  }

  clearPublicProfile() {
    this._publicProfile$.next(null);
  }

  deleteIceBreaker(iceBreakerId: number) {
    const removement$ = this._httpClient
      .delete(ICE_BREAKER_API_URLS.DELETE + `/${iceBreakerId}`)
      .pipe(
        switchMap(() => this.publicProfile$),
        take(1),
        map((userProfile) => userProfile.deleteIceBreaker(iceBreakerId)),
        tap((userProfile) => this._publicProfile$.next(userProfile)),
      );
    return firstValueFrom(removement$);
  }
}
