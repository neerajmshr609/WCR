import { Injectable } from '@angular/core';
import { Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(private readonly authService: AuthService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return !this.authService.userIsSignedIn();
  }
}
