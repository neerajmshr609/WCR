import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, skip } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  private navigateTo(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/auth'], {
      queryParams: { returnUrl },
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    const returnUrl = state.url;

    if (!this.authService.userIsSignedIn()) {
      return this.navigateTo(returnUrl);
    }

    if (this.authService.userSubject$.value) {
      return true;
    }

    return this.authService.userSubject$.pipe(
      skip(1),
      map((user) => (user ? true : this.navigateTo(returnUrl))),
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    const returnUrl = route.path;

    if (!this.authService.userIsSignedIn()) {
      return this.navigateTo(returnUrl);
    }

    if (this.authService.userSubject$.value) {
      return true;
    }

    return this.authService.userSubject$.pipe(
      skip(1),
      map((user) => (user ? true : this.navigateTo(returnUrl))),
    );
  }
}
