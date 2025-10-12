import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { User, userFactory } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import {
  API_URL,
  AUTH_MAGIC_LINK_URL,
  AUTH_URL,
  PASSWORD_URL,
  REGISTER_REFERRAL_URL,
  RESEND_CONFIRMATION_URL,
  RESEND_MAGIC_LINK,
  SIGN_IN_URL,
  sign_in_with_token,
  SWITCH_EMAIL_NOTIFICATIONS,
  UPDATE_PASSWORD_URL,
  VALIDATE_TOKEN_URL,
} from 'src/config/config';
import { Ruleset } from '../shared/models/ruleset';
import { BaseResponse } from '../shared/models/base-response.interface';
import { Scheduling } from '../pages/usersettings/interfaces';
import { LocalStorageSegmentFactoryService } from '../services/local-storage/local-storage-segment-factory.service';
import {
  createAnonUserLocalStorageData,
  IAuthServiceLocalStorage,
} from './model/auth-service-local-storage.inteface';
import { HOME_PAGE_ROUTE } from '../../config/shared-routes';
import { toSignal } from '@angular/core/rxjs-interop';
import { SignupDTO } from './model/sign-up-dto.interface';
import {
  AnonymousUser,
  createAnonymousUser,
} from '../shared/models/user/anonymous-user.model';
import { IAnonymousUserResponse } from './model/anonymous-user-response.interface';
import { Conversation } from '../shared/models/conversation.model';
import {
  LOGIN_PAGE_PATH_SEGMENTS,
  RESET_PASSWORD_PAGE_PATH_SEGMENTS,
  SIGNUP_PAGE_PATH_SEGMENTS,
} from './auth-routing.module';
import { AUTH_MODE, AuthMode } from './model/auth-mode';
import { AUTHORIZATION_API_URLS } from './service/authorization.api-urls.provider';

export interface SignInWithTokenResponse {
  success: boolean;
  data: User;
  auth_token: {
    'access-token': string;
    'token-type': string;
    client: string;
    expiry: string;
    uid: string | number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userId: number;

  private readonly _authorizedUser$ = new BehaviorSubject<User | AnonymousUser>(
    null,
  );
  // TODO: Refactor to make private
  readonly userSubject$ = this._authorizedUser$;

  readonly authorizedUser$ = this._authorizedUser$.asObservable();
  private readonly _authLocalStorage =
    this._localStorageSegmentFactoryService.getExistingOrCreate<IAuthServiceLocalStorage>(
      AuthService.name,
    );

  get localStorage() {
    return this._authLocalStorage;
  }

  readonly storageState$ = this._authLocalStorage.localStorageState$;

  readonly hasAuthorizationData$ = this.storageState$.pipe(
    map((_) => {
      return _.accessToken && _.tokenType && _.client && _.uid && _.expiry;
    }),
  );

  readonly anonymousUserId$ = this.storageState$.pipe(
    map((_) => parseInt(_.temp_user_id, 10)),
  );

  readonly isAnonymousUser$ = this.anonymousUserId$.pipe(
    map((_) => !Number.isNaN(_)),
  );
  readonly userIsSignedIn$ = combineLatest([
    this.hasAuthorizationData$,
    this.isAnonymousUser$,
  ]).pipe(
    map(
      ([hasAuthorizationData, isAnonymousUser]) =>
        hasAuthorizationData && !isAnonymousUser,
    ),
  );

  readonly authUserShareToken$ = this.userIsSignedIn$.pipe(
    filter((_) => !!_),
    switchMap(() => this.authorizedUser$),
    map((_) => _?.sharetoken),
  );

  readonly isAnonymousUser = toSignal(this.isAnonymousUser$);
  readonly _lastConversationId = toSignal(
    this.storageState$.pipe(map((_) => _.conversation_id)),
  );
  private readonly _anonymousUserId = toSignal(this.anonymousUserId$);

  readonly notAuthorizedOrAnonymousUser$ = combineLatest([
    this.storageState$,
    this.authorizedUser$,
  ]).pipe(map(([{ temp_user_id }, user]) => !!(!user || temp_user_id)));

  readonly allowNotAuthorizedUserToAuth$ = combineLatest([
    this.userIsSignedIn$,
    this.isAnonymousUser$,
    this.storageState$,
  ]).pipe(
    map(
      ([userIsSignedIn, isAnonymousUser, storageState]) =>
        (!userIsSignedIn && !isAnonymousUser) ||
        (isAnonymousUser &&
          Number.isInteger(storageState.last_completed_conversation_id)),
    ),
  );

  readonly userIsSignedIn = toSignal(this.userIsSignedIn$);
  readonly userProfileInfo$ = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly _localStorageSegmentFactoryService: LocalStorageSegmentFactoryService,
    @Inject('SIGN_OUT_URL')
    private readonly _signOutUrl: string,
  ) {
    this._subscribeAuthUserOnLocalStorageState();
  }

  private _subscribeAuthUserOnLocalStorageState() {
    this.localStorage.localStorageState$.subscribe(({ temp_user_id }) => {
      if (temp_user_id) {
        const anonUser = createAnonymousUser(+temp_user_id);
        this._authorizedUser$.next(anonUser);
      }
    });
  }

  resetConfirmPassword(newpass: string, resetToken: string) {
    return this.http.post(UPDATE_PASSWORD_URL, {
      reset_password_token: resetToken,
      password: newpass,
    });
  }

  requestConfirmationEmail(email: string) {
    return this.http.post<User>(RESEND_CONFIRMATION_URL, { email });
  }

  resetPassword(email: string) {
    return this.http.post(PASSWORD_URL, {
      email,
    });
  }

  fetchUserForProfileToken(token: string) {
    const url = API_URL + 'users?sharetoken=' + token;

    return this.http.get<User>(url).pipe(
      map((user) => {
        this.userProfileInfo$.next(user);
        return user;
      }),
    );
  }

  fetchUserByEmail(email: string) {
    const url = API_URL + 'userByEmail?email=' + email;

    return this.http.get<User>(url);
  }

  fetchUser(userId: number) {
    const url = API_URL + 'users/' + userId;
    return this.http.get<User>(url);
  }

  public signInWithToken(token: string): Observable<SignInWithTokenResponse> {
    return this.http
      .get<SignInWithTokenResponse>(`${sign_in_with_token}${token}`)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.storeJSONAccessData(res.auth_token);
            this._authorizedUser$.next(res.data);
            this.userSubject$.next(res.data);
          }
        }),
      );
  }

  login(body: {
    email: string;
    password: string;
    invite_token?: string;
    user_anonymous_id?: number;
    conversation_id?: number;
  }) {
    body.user_anonymous_id = this._anonymousUserId() || null;
    body.conversation_id =
      body.conversation_id || this._lastConversationId() || null;

    return this.http.post(SIGN_IN_URL, body, { observe: 'response' }).pipe(
      tap((res: HttpResponse<any>) => this.storeAccessData(res.headers)),
      map((res: HttpResponse<any>) => res.body),
      map((res: { data: User }) => res.data),
      switchMap((res: User) => this.fetchUser(res.id)),
      tap((user: User) => this.userSubject$.next(user)),
    );
  }

  storeAccessData(fromHeaders: HttpHeaders) {
    const data: IAuthServiceLocalStorage = {
      accessToken: fromHeaders.get('access-token'),
      client: fromHeaders.get('client'),
      expiry: fromHeaders.get('expiry'),
      tokenType: 'Bearer',
      uid: fromHeaders.get('uid'),
    };
    this._authLocalStorage.replaceState(data);
  }

  storeJSONAccessData(data) {
    this._authLocalStorage.replaceState({
      accessToken: data['access-token'],
      client: data.client,
      expiry: data.expiry,
      tokenType: 'Bearer',
      uid: data.uid,
    });
  }

  signUp(signUpData: SignupDTO) {
    signUpData.user_anonymous_id = this._anonymousUserId() || null;
    signUpData.conversation_id = this._lastConversationId() || null;
    return this.http.post(AUTH_MAGIC_LINK_URL, signUpData, {
      observe: 'response',
    });
  }

  resendMagicLink(email: string): Observable<User> {
    return this.http.post<User>(RESEND_MAGIC_LINK, { email });
  }

  registerReferral(userId: number, referredByToken: string) {
    return this.http.post<User>(REGISTER_REFERRAL_URL, {
      userId,
      referredByToken,
    });
  }

  updateUser(user: User) {
    const url = API_URL + 'users/' + user.id;

    return this.http.put<User>(url, { user }).pipe(
      map((user) => userFactory(user)),
      tap((res) => this.userSubject$.next(res)),
    );
  }

  updateAuthorizedUser(data: Partial<User>) {
    return this.userIsSignedIn$.pipe(
      filter((_) => _),
      take(1),
      switchMap(() => this.authorizedUser$.pipe(take(1))),
      switchMap((_) => {
        const url = [AUTHORIZATION_API_URLS.PATCH, _.id].join('/');
        return this.http.patch(url, { ...data });
      }),
      map((_) => userFactory(_)),
      tap((_) => this._authorizedUser$.next(_)),
      switchMap((_) => this.authorizedUser$.pipe(take(1))),
    );
  }

  public switchEmailNotification(): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(SWITCH_EMAIL_NOTIFICATIONS, {});
  }

  autoLogin() {
    return this._authLocalStorage.localStorageState$.pipe(
      switchMap((_) =>
        _.accessToken && !this._anonymousUserId()
          ? this.http.get(VALIDATE_TOKEN_URL).pipe(
              map((res: { data: User }) => res.data),
              mergeMap((res: User) => this.fetchUser(res.id)),
              map((user) => userFactory(user)),
              tap((res: User) => this.userSubject$.next(res)),
            )
          : of(EMPTY),
      ),
    );
  }

  private _logout(
    params: { navigateAfterPage: any[] | null } = {
      navigateAfterPage: [HOME_PAGE_ROUTE],
    },
  ) {
    this._authLocalStorage.clearState();
    this.userSubject$.next(null);
    if (params.navigateAfterPage) {
      this.router.navigate(params.navigateAfterPage);
    }
  }

  logout(
    params: { navigateAfterPage: any[] | null } = {
      navigateAfterPage: [HOME_PAGE_ROUTE],
    },
  ) {
    return new Promise<void>((resolve, reject) => {
      this.http.delete(this._signOutUrl).subscribe({
        error: () => {
          this._logout(params);
          reject();
        },
        complete: () => {
          this._logout(params);
          resolve();
        },
      });
    });
  }

  isAnon(userId) {
    // TODO: Remove BACKDOOR -------- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return !userId || userId === 156;
  }

  createScheduling(data: Ruleset) {
    const url = API_URL + 'rulesets';
    return this.http.post<Ruleset>(url, data);
  }

  getListScheduling() {
    const url = API_URL + `users/scheduling`;
    return this.http.get<Scheduling>(url);
  }

  deleteItemScheduling(id: number) {
    const url = API_URL + `rulesets/${id}`;
    return this.http.delete(url);
  }

  setAnonymousUser(userIdOrAuthObject: number | IAnonymousUserResponse) {
    if (Number.isInteger(userIdOrAuthObject)) {
      this.localStorage.replaceState({
        temp_user_id: userIdOrAuthObject.toString(),
      });
    } else if (typeof userIdOrAuthObject === 'object') {
      this.localStorage.replaceState(
        createAnonUserLocalStorageData(userIdOrAuthObject),
      );
    } else {
      throw new Error(`Invalid anonymous user id`);
    }
  }

  createAnonUser(user_id: number): User {
    return createAnonymousUser(user_id);
  }

  storeLastConversation(conversation: Conversation) {
    if (this.isAnonymousUser()) {
      this._authLocalStorage.updateState({ conversation_id: conversation.id });
    }
  }

  openLoginForm(params: { returnUrl?: string } = {}) {
    this.router.navigate([{ outlets: { modal: LOGIN_PAGE_PATH_SEGMENTS } }], {
      queryParams: { ...params },
    });
  }

  openSignUpForm(params: { returnUrl?: string; hide_company?: boolean } = {}) {
    this.router.navigate([{ outlets: { modal: SIGNUP_PAGE_PATH_SEGMENTS } }], {
      queryParams: { ...params },
    });
  }

  openResetPasswordForm(params: { returnUrl?: string } = {}) {
    this.router.navigate(
      [{ outlets: { modal: RESET_PASSWORD_PAGE_PATH_SEGMENTS } }],
      {
        queryParams: { ...params },
      },
    );
  }

  openAuthForm(mode: AuthMode, params: { returnUrl?: string } = {}) {
    if (mode === AUTH_MODE.LOGIN) {
      this.openLoginForm(params);
    } else if (mode === AUTH_MODE.SIGNUP) {
      this.openSignUpForm(params);
    } else if (mode === AUTH_MODE.RESET_PASSWORD) {
      this.openResetPasswordForm(params);
    }
  }

  acceptByToken(token: string): Observable<any> {
    return of({ success: true }); //this.http.post(ACCEPT_BY_TOKEN_URL, { token });
  }
}
