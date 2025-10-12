import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { Invitation, invitationFactory } from '../model/invitation.model';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { IAcceptTokenResponse } from '../model/response/accept-invitation-response.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { HOME_PAGE_ROUTE } from '../../../../config/shared-routes';
import { ACCEPT_ORG_INVITATION_URL_SEGMENTS_WITH } from '../routing/organization-invitation-routing.module';
import { OutletService } from '../../../services/outlet.service';
import { INVITATION_API_URLS } from './invitation-api-urls.provider';
import { IInvitationResponse } from '../model/response/invitation-response.interface';
import { IRejectInvitationResponse } from '../model/response/reject-invitation-response.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class OrganizationInvitationService {
  private readonly _defaultErrorMsg = toSignal(
    this._translate.get('accept_invite.something_went_wrong'),
  );
  private readonly _isLoading$ = new BehaviorSubject(false);
  private readonly _invitation$ = new BehaviorSubject<Invitation | null>(null);
  public hasError = new BehaviorSubject<boolean>(null);

  readonly invitation$ = this._invitation$.asObservable();
  readonly currentUserInvited$ = combineLatest([
    this._authService.authorizedUser$,
    this.invitation$,
  ]).pipe(
    map(([user, invitation]) => {
      return user && invitation && invitation.isCurrentUserInvited(user);
    }),
  );

  readonly invitationPageUrlSegments$ = this.invitation$.pipe(
    map((_) =>
      _?.token ? ACCEPT_ORG_INVITATION_URL_SEGMENTS_WITH(_.token) : null,
    ),
  );

  readonly displayMiniMinimizedInvitation$ = combineLatest([
    this.invitation$,
    this.invitationPageUrlSegments$,
    this._outletService.navigationEnd$,
    this._outletService.isModalActivate$,
  ]).pipe(
    map(([invitation, pageSegments, { url }, isModalActive]) => {
      const currentRouteIsOrganizationInvitationPage =
        pageSegments && url.includes(pageSegments.join('/'));
      return (
        invitation &&
        (!currentRouteIsOrganizationInvitationPage ||
          (currentRouteIsOrganizationInvitationPage && isModalActive))
      );
    }),
  );

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _snackBar: MatSnackBar,
    private readonly _translate: TranslateService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _outletService: OutletService,
  ) {}

  private _messageToSnackBar(message: string, duration = 4000) {
    this._snackBar.open(message, null, { duration });
  }

  private _errorResponseHandler(error?: HttpErrorResponse) {
    this._messageToSnackBar(error?.message || this._defaultErrorMsg());
    this.onFetchErrorNavigation();
    return throwError(() => error);
  }

  private _fetchInvitation(invitationToken: string) {
    return this._httpClient
      .get<IInvitationResponse>(`${INVITATION_API_URLS.GET}/${invitationToken}`)
      .pipe(
        catchError(({ error }) => this._errorResponseHandler(error)),
        map(({ data: { invite_info } }) =>
          invitationFactory(invitationToken, invite_info),
        ),
      );
  }

  private _acceptInvitation(invitation: Invitation) {
    return this._httpClient
      .post<IAcceptTokenResponse>(
        `${INVITATION_API_URLS.POST}`,
        invitation.toHttpBody(),
      )
      .pipe(
        catchError(({ error }) => this._errorResponseHandler(error)),
        tap((_) => console.log('Accept invitation response ', _)),
      );
  }

  private _deleteInvitation(invitation: Invitation) {
    return this._httpClient
      .delete<IRejectInvitationResponse>(INVITATION_API_URLS.DELETE, {
        params: invitation.toHttpParams(),
      })
      .pipe(catchError(({ error }) => this._errorResponseHandler(error)));
  }

  private _startLoading() {
    this._isLoading$.next(true);
  }

  public completeLoading() {
    this._isLoading$.next(false);
  }

  public setInvitation(invitation: Invitation | null) {
    this._invitation$.next(invitation);
  }

  private _logoutIfNotOfCurrentUserInvitation(invitation: Invitation) {
    return this._authService.authorizedUser$.pipe(
      take(1),
      switchMap((currentUser) => {
        return currentUser && !invitation.isCurrentUserInvited(currentUser)
          ? fromPromise(
              this._authService.logout({ navigateAfterPage: null }),
            ).pipe(map(() => invitation))
          : of(invitation);
      }),
    );
  }

  logoutAndFetchInvitation(invitationToken: string) {
    this._startLoading();
    return this.invitation$.pipe(
      take(1),
      filter((_) => _ === null || _.token !== invitationToken),
      switchMap(() => this._fetchInvitation(invitationToken)),
      switchMap((_) => this._logoutIfNotOfCurrentUserInvitation(_)),
    );
  }

  acceptInvitation() {
    this._startLoading();
    this.invitation$
      .pipe(
        take(1),
        filter((_) => _ !== null),
        switchMap((_) => this._acceptInvitation(_)),
        tap(() => this.setInvitation(null)),
        switchMap((_) =>
          fromPromise(this._router.navigate([HOME_PAGE_ROUTE])).pipe(
            map(() => _.message),
          ),
        ),
      )
      .subscribe({
        next: (message) => this._messageToSnackBar(message),
        error: () => this.completeLoading(),
        complete: () => this.completeLoading(),
      });
  }

  declineInvitation() {
    this._startLoading();
    this.invitation$
      .pipe(
        take(1),
        filter((_) => _ !== null),
        switchMap((_) => this._deleteInvitation(_)),
        tap(() => this.setInvitation(null)),
        switchMap((_) =>
          this.afterDeclineNavigation().pipe(map(() => _.message)),
        ),
      )
      .subscribe({
        next: (message) => this._messageToSnackBar(message),
        error: () => this.completeLoading(),
        complete: () => this.completeLoading(),
      });
  }

  onFetchErrorNavigation() {
    this._authService.userIsSignedIn$.pipe(take(1)).subscribe((isSignedIn) => {
      this._router.navigate([HOME_PAGE_ROUTE]);
    });
  }

  afterDeclineNavigation() {
    return this._authService.userIsSignedIn$.pipe(
      take(1),
      switchMap((isSignedIn) => {
        return isSignedIn
          ? EMPTY
          : fromPromise(this._router.navigate([HOME_PAGE_ROUTE]));
      }),
    );
  }
}
