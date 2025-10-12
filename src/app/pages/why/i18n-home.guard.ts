import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class I18nHomeGuard {
  constructor(private readonly translateService: TranslateService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.translateService.get('home.header.text').pipe(mapTo(true));
  }
}
