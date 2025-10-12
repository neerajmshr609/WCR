import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { API_URL } from 'src/config/config';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.storageState$.pipe(
      take(1),
      map(({ accessToken, tokenType, client, uid, expiry }) => {
        const hasAuthData = accessToken && tokenType && client && uid && expiry;

        return hasAuthData && request.url.includes(API_URL)
          ? request.clone({
              setHeaders: {
                'access-token': String(accessToken),
                'token-type': String(tokenType),
                client: String(client),
                uid: String(uid),
                expiry: String(expiry),
              },
            })
          : request;
      }),
      switchMap((updatedRequest) => next.handle(updatedRequest)),
    );
  }
}
