import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

export function initUserData(authService: AuthService) {
  return () =>
    new Promise((resolve) => {
      authService
        .autoLogin()
        .pipe(
          catchError((error: HttpErrorResponse) => {
            resolve(null);
            return throwError(error);
          }),
        )
        .subscribe(() => {
          resolve(null);
        });
    });
}
