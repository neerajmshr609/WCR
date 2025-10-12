import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../../../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ShareProfileModalComponent } from '../../share-profile-modal/share-profile-modal.component';

@Component({
  selector: 'app-recommend-or-share-profile',
  templateUrl: './recommend-or-share-profile.component.html',
  styleUrls: ['./recommend-or-share-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendOrShareProfileComponent {
  readonly userProfile = toSignal(this._profileService.publicProfile$);
  readonly isProfileOfCurrentUser = toSignal(
    this._profileService.isProfileOwner$,
  );
  readonly userIsSignedIn = toSignal(this._authService.userIsSignedIn$);
  private readonly _isRecommended = toSignal(
    combineLatest([
      this._authService.authorizedUser$,
      this._profileService.publicProfile$,
    ]).pipe(
      map(
        ([authUser, userProfile]) =>
          authUser && userProfile && userProfile.isRecommended(authUser),
      ),
    ),
  );

  readonly isAlreadyRecommended = computed(
    () => this.userIsSignedIn() && this._isRecommended(),
  );

  constructor(
    private readonly _authService: AuthService,
    private readonly _profileService: ProfileService,
    private readonly _dialog: MatDialog,
  ) {}

  recommend() {
    this._profileService.recommendProfile();
  }

  shareProfile(): void {
    this._dialog.open(ShareProfileModalComponent);
  }
}
