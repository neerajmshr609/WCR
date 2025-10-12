import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            if (!['sign_in', 'password'].some((el) => req.url.includes(el))) {
              this.authService.logout();
            }
          }
        }
        return throwError(err);
      }),
    );
  }
}
