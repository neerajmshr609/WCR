import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { fadeAnimation, fader } from './shared/animations';
import { AnalyticsService } from './services/analytics.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as hammerjs from 'hammerjs';
import { SharedService } from './services/shared.service';
import { OnlineService } from './services/online.service';
import {
  debounceTime,
  delay,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { auditTime, combineLatest, EMPTY } from 'rxjs';
import LogRocket from 'logrocket';
import { environment } from 'src/environments/environment';
// import { PixelService } from 'ngx-pixel';
import { OneSignal } from 'onesignal-ngx';
import { WebPushService } from './services/web-push.service';
import { OutletService } from './services/outlet.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FooterService } from './services/footer/footer.service';
import { HeaderService } from './services/header/header.service';
import { ResizeService } from './services/resize.service';
import {
  FullscreenService,
  FullScreenState,
} from './services/fullscreen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // <-- add your animations here
    fadeAnimation,
    fader,
    trigger('slideInOut', [
      state('in', style({ top: 0 })),
      transition(':leave', [
        style({ top: 0 }),
        animate(300, style({ top: '-200px' })),
        // group([
        // animate('200ms ease-in-out', style({opacity: '0'}))
        // ])
      ]),
      transition(':enter', [
        style({ top: '-200px' }),
        animate(300, style({ top: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  showCookieNotification: boolean;
  hammerjs = hammerjs;
  public displayFooter = toSignal(this._footerService.displayFooter$);
  public isAuthPage: boolean;
  readonly isModalActive = toSignal(this._outletService.isModalActivate$);
  readonly mainContainerMarginTop = toSignal(this._headerService.heightPx$);
  readonly mainContainerMinHeight = toSignal(
    combineLatest([
      this._headerService.height$,
      this._footerService.height$,
    ]).pipe(
      map(([headerHeight, footerHeight]) => headerHeight + footerHeight - 4),
      map((_) => `calc(100vh - ${_}px - 4px)`),
    ),
  );

  @ViewChild('headerContainer')
  private readonly _headerContainer: ElementRef<HTMLElement>;
  @ViewChild('footerContainer')
  private readonly _footerContainer: ElementRef<HTMLElement>;
  public fullScreen = toSignal<FullScreenState | null>(
    this.fullScreenService.fullScreen$.pipe(
      map((state) =>
        state
          ? {
              forDevice: state.forDevice.map(
                (device) => `fullscreen-${device}`,
              ),
            }
          : null,
      ),
    ),
  );

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    // private pixelService: PixelService,
    private oneSignal: OneSignal,
    private readonly webPushService: WebPushService,
    private readonly _outletService: OutletService,
    onlineService: OnlineService,
    private readonly _resizeService: ResizeService,
    private readonly _headerService: HeaderService,
    private readonly _footerService: FooterService,
    private fullScreenService: FullscreenService,
  ) {
    this.analyticsService.subscribeTrackPageviewOnNavigationEnd();
    onlineService.subscribeToOnline().subscribe();
  }

  ngOnInit(): void {
    this.sharedService.init();
    this.analyticsService.initAnalytics();
    this.checkWebPushSubscription();

    if (!this.isTouchDevice()) {
      document.querySelector('body').classList.add('no-touch-screen');
    }

    this.sharedService.isAuthPage$.subscribe((res) => {
      this.isAuthPage = res;
      this.cdr.detectChanges();
    });

    if (environment.production && environment.logRocketAppId) {
      LogRocket.init(environment.logRocketAppId);

      this.authService.userSubject$
        .pipe(filter((res) => !!res))
        .subscribe((res) => {
          LogRocket.identify(res ? res.id.toString() : null, {
            name: res?.username || null,
            email: res?.email || null,
          });
        });
    }
    this.authService.userSubject$
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        this.webPushNotifications();
      });
  }

  private webPushNotifications(): void {
    this.oneSignal.init({
      appId: environment.oneSignal.appId,
      safari_web_id: environment.oneSignal.safari_web_id,
      notifyButton: {
        enable: true,
        colors: {
          'circle.background': 'rgb(0,0,0)',
        },
      },
      serviceWorkerPath: 'OneSignalSDKWorker.js',
      allowLocalhostAsSecureOrigin:
        environment.oneSignal.allowLocalhostAsSecureOrigin,
    });
  }

  private checkWebPushSubscription(): void {
    this.oneSignal.on('subscriptionChange', (isSubscribed: boolean) => {
      if (isSubscribed) {
        this.oneSignal.getUserId((userId: string) => {
          this.webPushService.subscribedToWebPush(userId).subscribe();
        });
      } else {
        this.oneSignal.getUserId((userId: string) => {
          this.webPushService.unsubscribeToWebPush(userId).subscribe();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.showCookieNotification = !localStorage.getItem(
      'hideCookieNotification',
    );
    if (localStorage.getItem('cookiesAccepted') && environment.production) {
      // this.pixelService.initialize();
    }
    this.cdr.detectChanges();
    this._subscribeOnHeaderHeightChange();
    this._subscribeOnFooterHeightChange();
  }

  hideNotification() {
    this.showCookieNotification = false;
    localStorage.setItem('hideCookieNotification', 'true');
    localStorage.setItem('cookiesAccepted', 'true');

    if (environment.production) {
      // this.pixelService.initialize();
    }
  }

  isTouchDevice() {
    return 'ontouchstart' in document.documentElement;
  }

  private get _headerContainerHeight() {
    return this._headerContainer.nativeElement.clientHeight;
  }

  private get _footerContainerHeight() {
    return this._footerContainer?.nativeElement?.clientHeight || 0;
  }

  private _subscribeOnHeaderHeightChange() {
    this._resizeService.resize$
      .pipe(
        map(() => this._headerContainerHeight),
        startWith(this._headerContainerHeight),
      )
      .subscribe((_) => {
        this._headerService.updateHeight(_);
      });
  }

  private _subscribeOnFooterHeightChange() {
    this._footerService.displayFooter$
      .pipe(
        auditTime(100),
        switchMap((isDisplay) => {
          return isDisplay
            ? this._resizeService.resize$.pipe(
                map(() => this._footerContainerHeight),
                startWith(this._footerContainerHeight),
              )
            : EMPTY;
        }),
      )
      .subscribe((_) => {
        this._footerService.updateHeight(_);
      });
  }
}
