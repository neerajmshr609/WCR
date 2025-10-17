import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostBinding,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { OnlineService } from 'src/app/services/online.service';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { OrganizationShort } from '../../../models/organizationShort';
import { LanguageService } from '../../../../services/language.service';
import { PermissionService } from '../../../../auth/service/permission.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ResizeService } from '../../../../services/resize.service';
import { OrganizationInvitationService } from '../../../../pages/organization-invitation/service/organization-invitation.service';
import { ConversationHeaderService } from '../providers/conversation-header.service';
import { OutletService } from '../../../../services/outlet.service';
import { CurrentRouteService } from '../providers/current-route.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent implements OnInit {
  readonly userIsSignedIn = toSignal(this.authService.userIsSignedIn$);
  readonly isSignedInCounselor = toSignal(this.permissionService.isCounselor$);
  readonly isDesktop = toSignal(this._resizeService.isDesktop$);
  readonly isMobile = toSignal(this._resizeService.isSmall$);
  readonly isNotDesktop$ = this._resizeService.isNotDesktopScreen$;
  readonly conversationHeaderContent = toSignal(
    this.conversationHeaderService.conversationHeaderComponent$,
  );
  public organization = input<OrganizationShort>(null);
  readonly displayMiniMinimizedInvitation = toSignal(
    this._organizationInvitationService.displayMiniMinimizedInvitation$,
  );

  public showNewFeedback = true;

  public openMobileMenu = signal<boolean>(false);

  public get isInsights(): boolean {
    return /insights/.test(this.router.url);
  }
  private destroyRef = inject(DestroyRef);

  readonly authorizedUser = toSignal(this.authService.authorizedUser$);

  private pathTitle$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    switchMap(() =>
      this.activatedRoute.firstChild
        ? this.activatedRoute.firstChild.data
        : this.activatedRoute.data,
    ),
    map((data) => data.pathTitle),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  constructor(
    public authService: AuthService,
    private messagesService: MessagesService,
    private onlineService: OnlineService,
    private webSocketService: WebsocketService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    public readonly languageService: LanguageService,
    readonly permissionService: PermissionService,
    private readonly _resizeService: ResizeService,
    private conversationHeaderService: ConversationHeaderService,
    private readonly _organizationInvitationService: OrganizationInvitationService,
    private readonly _outletService: OutletService,
    private currentRouteService: CurrentRouteService,
  ) {
    super();
    this.pathTitle$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.currentRouteService.pathTitle.next(res);
      });
  }

  readonly subName = computed(() => {
    const user = this.authorizedUser();
    console.log('USER', user);
    if (!user) return '';

    // Check if user is organization member by looking for organization property
    return user.display_name ?? user.username ?? user.name ?? '';
  });

  @HostBinding('style.position') width = this.openMobileMenu()
    ? 'fixed'
    : 'static';

  ngOnInit() {
    this.subscribeToRouter();
  }

  subscribeToRouter() {
    this.router.events
      .pipe(
        takeUntil(this.destroyed),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        if (this.isInsights) {
          this.showNewFeedback = false;
        }
      });
  }

  openLoginModal(): void {
    this.authService.openLoginForm({ returnUrl: this.router.url });
  }

  openSignupModal(): void {
    this.authService.openSignUpForm({ returnUrl: this.router.url });
  }

  onLogout() {
    this.webSocketService.closeConnection();
    this.onlineService.subscribeToOnline().subscribe();
    this.sharedService.feedbackRequestsCount = 0;
    this.messagesService.unreadMessages$.next(0);
    this.authService.logout();
  }

  navigateToBlogPage() {
    this._outletService.navigateToBlogSite();
  }

  onMobileMenuOpen($event: boolean): void {
    this.openMobileMenu.set($event);
  }
}
