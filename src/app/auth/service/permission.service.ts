import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permissions, permissionsFactory } from '../model/permissions.model';

@Injectable({
  providedIn: 'any',
})
export class PermissionService {
  readonly permissions$ = this._getAuthUserPermissions();
  readonly isCounselor$ = this.permissions$.pipe(map(_ => !!_?.isCounselor()));
  readonly isClient$ = combineLatest([this._authService.userIsSignedIn$, this.permissions$])
    .pipe(map(([userIsSignedIn, permissions]) => userIsSignedIn && permissions.isClient()));
  readonly isAdmin$ = this.permissions$.pipe(map(_ => !!_?.isAdmin()));

  constructor(private readonly _authService: AuthService) {
  }

  private _getAuthUserPermissions() {
    return this._authService.authorizedUser$.pipe(
      map((authUser) => {
        let permissions;
        if (authUser) {
          if (!(authUser?.permissions instanceof Permissions)) {
            authUser.permissions = permissionsFactory(authUser.permissions, !!authUser?.admin);
          }
          permissions = authUser.permissions;
        } else {
          permissions = permissionsFactory();
        }
        return permissions as Permissions;
      }),
    );
  }
}
