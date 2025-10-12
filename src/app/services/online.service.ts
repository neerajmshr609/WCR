import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { API_URL } from 'src/config/config';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';
import { AuthService } from '../auth/auth.service';
import { createHttpParams } from '../shared/functions/http-params';

@Injectable({
  providedIn: 'root',
})
export class OnlineService {
  readonly onlineChannel = this._authService.storageState$
    .pipe(
      filter(_ => !!(_.accessToken && _.client && _.uid)),
      map(({ accessToken, client, uid }) => createHttpParams({
        'access-token': accessToken, client, uid,
      }).toString()),
      map(_ => this.cableService
        .cable(`${environment.wsBase}?${_}`)
        .channel('AppearanceChannel', { room: 'appearance_channel' }),
      ),
    );
  userChangedOnlineStatus$ = new BehaviorSubject<{
    id: number;
    online: boolean;
  }>(null);


  constructor(
    private cableService: ActionCableService,
    private http: HttpClient,
    private readonly _authService: AuthService,
  ) {
  }

  subscribeToOnline() {
    return this.onlineChannel.pipe(
      switchMap(_ => _.received()),
      tap((res) => this.userChangedOnlineStatus$.next(res)),
      filter((message) => !message.updated),
    );
  }

  updateOnlineStatus(value: boolean, userId: number): Observable<User> {
    const url = API_URL + `/users/${userId}`;

    return this.http.put<User>(url, { online: value });
  }
}
