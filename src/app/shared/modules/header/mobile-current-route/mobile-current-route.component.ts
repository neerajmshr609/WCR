import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HomeIconComponent } from '../../../icons/home-icon/home-icon.component';
import { ConversationsIconComponent } from '../../../icons/conversations-icon/conversations-icon.component';
import { UploadIconComponent } from '../../../icons/upload-icon/upload-icon.component';
import { BlogIconComponent } from '../../../icons/blog-icon/blog-icon.component';
import { RequestIconComponent } from '../../../icons/request-icon/request-icon.component';
import { AddMembersIconComponent } from '../../../icons/add-members-icon/add-members-icon.component';
import { LikeIconComponent } from '../../../icons/like-icon/like-icon.component';
import { NewsIconComponent } from '../../../icons/news-icon/news-icon.component';
import { IconShapeImpactComponent } from '../../../icons/icon-shape-impact/icon-shape-impact.component';
import { IconOptionComponent } from '../../../icons/icon-option/icon-option.component';
import { CounsellorDeskIconComponent } from '../../../icons/counsellor-desk-icon/counsellor-desk-icon.component';
import { IconCapsuleClosedComponent } from '../../../icons/icon-capsule-closed/icon-capsule-closed.component';
import { map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { OutletService } from '../../../../services/outlet.service';
import { Router } from '@angular/router';
import { CurrentRouteService } from '../providers/current-route.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-mobile-current-route',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HomeIconComponent,
    ConversationsIconComponent,
    UploadIconComponent,
    BlogIconComponent,
    RequestIconComponent,
    AddMembersIconComponent,
    LikeIconComponent,
    NewsIconComponent,
    IconShapeImpactComponent,
    IconOptionComponent,
    CounsellorDeskIconComponent,
    IconCapsuleClosedComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mobile-current-route.component.html',
  styleUrls: ['./mobile-current-route.component.scss'],
})
export class MobileCurrentRouteComponent {
  public openMenuState = input(false);
  private destroyRef = inject(DestroyRef);
  readonly authorizedUser = toSignal(this._authService.authorizedUser$);
  private readonly _authModal$ = this._outletService.currentUrl$.pipe(
    startWith(this._router.url),
    map((url) => {
      const patternAuth = /modal:auth/;
      return patternAuth.test(url)
        ? url.includes('login')
          ? 'login'
          : 'sign_up-line'
        : null;
    }),
  ) as Observable<'login' | 'sign_up-line' | null>;

  public authModal = toSignal(this._authModal$);

  public pathTitle$ = new BehaviorSubject<string>(null);

  constructor(
    private readonly _authService: AuthService,
    private readonly _outletService: OutletService,
    private readonly _router: Router,
    private currentRoute: CurrentRouteService,
  ) {
    this.currentRoute.pathTitle
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.pathTitle$.next(res);
      });
  }

  readonly subName = computed(() => {
    const user = this.authorizedUser();
    console.log('USER', user);
    if (!user) return '';

    // Check if user is organization member by looking for organization property
    return user.display_name ?? user.username ?? user.name ?? '';
  });
}
