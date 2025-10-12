import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_URL, SIGN_IN_URL } from '../../../config/config';

@Injectable()
export class WebPushPlayerIdInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const webPushPlayerId = localStorage.getItem('player-id');
    if (
      webPushPlayerId &&
      (request.url.includes(SIGN_IN_URL) || request.url.includes(AUTH_URL))
    ) {
      request = request.clone({
        setHeaders: {
          'player-id': webPushPlayerId,
        },
      });
    }
    return next.handle(request);
  }
}
