import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OutletService {
  constructor(
    private readonly _router: Router,
    private readonly _location: Location,
  ) {}

  readonly navigationEnd$ = this._router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
  ) as Observable<NavigationEnd>;

  readonly currentUrl$ = this.navigationEnd$.pipe(map((_) => _.url));

  readonly isModalActivate$ = this.navigationEnd$.pipe(
    map(() => 'modal' in this._router.parseUrl(this._router.url).root.children),
  );

  closeModalOutlet(): void {
    this._router.navigate([{ outlets: { modal: null } }]);
  }

  navigateBack() {
    this._location.back();
  }

  navigateToBlogSite() {
    const host = location.host.replace('blog.', '');
    const blogUrl = `${location.protocol}//blog.${host}`;
    location.assign(blogUrl);
  }
}
