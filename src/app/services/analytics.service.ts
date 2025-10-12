import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OutletService } from './outlet.service';

declare let ga: any;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(
    private readonly _outletService: OutletService,
  ) {
  }

  subscribeTrackPageviewOnNavigationEnd() {
    if (environment.analyticsEnabled) {
      this._outletService.navigationEnd$
        .subscribe(({ urlAfterRedirects }) => {
          this.trackPageview(urlAfterRedirects);
        });
    }
  }

  initAnalytics() {
    if (!environment.analyticsEnabled) {
      return;
    }

    ga('create', 'UA-74986399-10', 'auto');
  }

  trackEvent(category: string, action: string) {
    if (!environment.analyticsEnabled) {
      return;
    }

    ga('send', 'event', {
      eventCategory: category,
      eventAction: action,
    });
  }

  trackPageview(page: string) {
    if (!environment.analyticsEnabled) {
      return;
    }

    ga('set', 'page', page);
    ga('send', 'pageview');
  }
}
