import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BlogIconComponent } from '../../../icons/blog-icon/blog-icon.component';
import { ConversationsIconComponent } from '../../../icons/conversations-icon/conversations-icon.component';
import { CounsellorDeskIconComponent } from '../../../icons/counsellor-desk-icon/counsellor-desk-icon.component';
import { HomeIconComponent } from '../../../icons/home-icon/home-icon.component';
import { LikeIconComponent } from '../../../icons/like-icon/like-icon.component';
import { NewsIconComponent } from '../../../icons/news-icon/news-icon.component';
import { RequestIconComponent } from '../../../icons/request-icon/request-icon.component';
import { HeaderMobileNavbarItemComponent } from '../header-mobile-navbar-item/header-mobile-navbar-item.component';
import { IconMoreVerticalComponent } from '../../../icons/icon-more-vertical/icon-more-vertical.component';
import { PermissionService } from '../../../../auth/service/permission.service';
import { AuthService } from '../../../../auth/auth.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IconShapeImpactComponent } from '../../../icons/icon-shape-impact/icon-shape-impact.component';
import { CounsellorDeskModule } from '../../../../pages/counsellor-desk/counsellor-desk.module';
import { IconCapsuleClosedComponent } from '../../../icons/icon-capsule-closed/icon-capsule-closed.component';
import { IconPublicProfileComponent } from '../../../icons/icon-public-profile/icon-public-profile.component';
import { IconGlobeComponent } from '../../../icons/icon-globe/icon-globe.component';
import { IconBriefingsComponent } from '../../../icons/icon-briefings/icon-briefings.component';
import { IconLogOutComponent } from '../../../icons/icon-log-out/icon-log-out.component';
import { IconSettingsGearComponent } from '../../../icons/icon-settings-gear/icon-settings-gear.component';
import { ResizeService } from '../../../../services/resize.service';
import { LanguageService } from '../../../../services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalSelectComponent } from '../../../complex-ui-components/modal-select/modal-select.component';
import {
  LANGUAGES_CODE_TYPE,
  LANGUAGES_TITLES,
} from '../../../app-language/data';
import { isArrayAndHasItems } from '../../../lib/array-helpers.lib';
import { MobileCurrentRouteComponent } from '../mobile-current-route/mobile-current-route.component';
import { OutletService } from '../../../../services/outlet.service';

import { PROFILE_PATH } from '../../../../pages/profile/routing/profile.paths';
import { ICE_BREAKER_CREATE_PATH } from 'src/app/ice-breaker/routing/ice-breaker.paths';
import { slideOutDownAnimation } from 'angular-animations';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconButton,
    MatMenu,
    TranslateModule,
    MatDivider,
    MatMenuTrigger,
    BlogIconComponent,
    ConversationsIconComponent,
    CounsellorDeskIconComponent,
    HomeIconComponent,
    LikeIconComponent,
    NewsIconComponent,
    RequestIconComponent,
    HeaderMobileNavbarItemComponent,
    IconMoreVerticalComponent,
    IconShapeImpactComponent,
    CounsellorDeskModule,
    IconCapsuleClosedComponent,
    IconPublicProfileComponent,
    IconGlobeComponent,
    IconBriefingsComponent,
    IconLogOutComponent,
    IconSettingsGearComponent,
    MobileCurrentRouteComponent,
  ],
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss'],
})
export class DropDownMenuComponent implements AfterViewInit {
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  public mobileMenuIsOpen = output<boolean>();
  public menuOpenState = signal(false);

  private destroyRef = inject(DestroyRef);
  readonly authorizedUser = toSignal(this._authService.userIsSignedIn$);
  readonly authUserShareToken = toSignal(
    this._authService.authUserShareToken$,
    { initialValue: null },
  );
  readonly profileLink = computed(() => {
    const profileToken = this.authUserShareToken();
    return profileToken ? PROFILE_PATH.toStringUrl({ profileToken }) : null;
  });

  readonly isSignedInAsCounselor = toSignal(
    this.permissionService.isCounselor$,
  );
  readonly isAdmin = toSignal(this.permissionService.isAdmin$);
  readonly isNotDesktop$ = this._resizeService.isNotDesktopScreen$;
  readonly isNotDesktop = toSignal(this._resizeService.isNotDesktopScreen$);
  readonly languagesOptions = Object.values(LANGUAGES_TITLES).map((_) => ({
    name: _,
  }));
  readonly currentLanguageOption = computed(() => ({
    name: this.languageService.currentLanguageTitle(),
  }));
  readonly MENU_URLS = {
    CREATE_ICE_BREAKER: ICE_BREAKER_CREATE_PATH.toStringUrl(),
  } as const;

  constructor(
    private readonly _authService: AuthService,
    readonly permissionService: PermissionService,
    private readonly _resizeService: ResizeService,
    readonly languageService: LanguageService,
    private readonly _dialog: MatDialog,
    private readonly _outletService: OutletService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  public logoutEvent = output();

  public onLogout() {
    this.logoutEvent.emit();
  }

  navigateToBlogPage() {
    this._outletService.navigateToBlogSite();
  }

  openLanguageSelectModal(): void {
    this._dialog
      .open(ModalSelectComponent, {
        data: {
          title: 'select-language-modal.title',
          label: 'select-language-modal.label',
          options: this.languagesOptions,
          preSelected: this.currentLanguageOption(),
          placeholder: 'select language',
          cancel_btn_text: 'select-language-modal.cancel_btn_text',
          save_btn_text: 'select-language-modal.save_btn_text',
        },
      })
      .afterClosed()
      .subscribe(({ name: languageTitle }) => {
        const lang = Object.entries(LANGUAGES_TITLES).find(
          ([, title]) => title === languageTitle,
        );
        if (isArrayAndHasItems(lang)) {
          this.languageService.setCurrentLanguage(
            lang[0] as LANGUAGES_CODE_TYPE,
          );
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.matMenuTrigger) {
      this.matMenuTrigger.menuOpened
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((state) => {
          this.mobileMenuIsOpen.emit(true);
          this.menuOpenState.set(true);
          if (this.isNotDesktop()) {
            const header =
              document.getElementsByClassName('header-container')[0];
            const body = document.getElementsByTagName('body')[0];
            const main = document.getElementsByTagName('main')[0];
            this.setElementsForOpenMenu(header, body, main);
          }
        });

      this.matMenuTrigger.menuClosed
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((state) => {
          this.menuOpenState.set(false);
          this.mobileMenuIsOpen.emit(false);
          if (this.isNotDesktop()) {
            const header =
              document.getElementsByClassName('header-container')[0];
            const body = document.getElementsByTagName('body')[0];
            const main = document.getElementsByTagName('main')[0];
            this.setElementsForClosedMenu(header, body, main);
          }
        });
    }
  }

  private setElementsForOpenMenu(
    header: Element,
    body: HTMLElement,
    main: HTMLElement,
  ) {
    header.setAttribute('style', 'position: static;');
    main.style.marginTop = '0';
    window.scrollTo(0, 0);
    body.setAttribute('style', 'overflow: hidden;');
  }

  private setElementsForClosedMenu(
    header: Element,
    body: HTMLElement,
    main: HTMLElement,
  ) {
    main.style.marginTop = '51px';
    header.setAttribute('style', 'position: fixed;');
    body.setAttribute('style', 'overflow: auto;');
  }
}
