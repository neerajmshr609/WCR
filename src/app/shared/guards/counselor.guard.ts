import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../../auth/service/permission.service';
import { map } from 'rxjs/operators';
import { PAGE_NOT_FOUND_PATH } from '../../pages/page-not-found/page-not-found-path';

export const counselorGuard: CanActivateFn = () => {
  const permissionsService = inject(PermissionService);
  const router = inject(Router);
  return permissionsService.permissions$.pipe(
    map((_) => _.isCounselor() || PAGE_NOT_FOUND_PATH.createUrlTree(router)),
  );
};
