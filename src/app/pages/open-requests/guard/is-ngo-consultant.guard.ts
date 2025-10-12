import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PermissionService } from '../../../auth/service/permission.service';

@Injectable({ providedIn: 'any' })
export class IsNgoConsultantGuard {
  constructor(private permissionService: PermissionService) {}

  canActivate(): Observable<boolean> {
    return this.permissionService.permissions$.pipe(
      take(1),
      map((_) => _.isCounselor()),
    );
  }

  canLoad(): Observable<boolean> {
    return this.canActivate();
  }
}
