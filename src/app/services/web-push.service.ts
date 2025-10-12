import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebPushService {
  constructor(private readonly http: HttpClient) {}

  subscribedToWebPush(playerId: string): Observable<unknown> {
    localStorage.setItem('player-id', playerId);
    return this.http.post(`${API_URL}users/web_push`, {
      player_id: playerId,
    });
  }

  unsubscribeToWebPush(playerId: string): Observable<unknown> {
    localStorage.removeItem('player-id');
    return this.http.request('delete', `${API_URL}users/web_push`, {
      body: {
        player_id: playerId,
      },
    });
  }
}
