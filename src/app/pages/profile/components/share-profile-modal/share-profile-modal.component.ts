import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-share-profile-modal',
  templateUrl: './share-profile-modal.component.html',
  styleUrls: ['./share-profile-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareProfileModalComponent {
  readonly userProfile = toSignal(this._profileService.publicProfile$);
  readonly isProfileOwner = toSignal(this._profileService.isProfileOwner$);
  readonly isOrganizationMember = computed(() =>
    this.userProfile().isOrganizationMember(),
  );
  readonly profileUrl = toSignal(this._profileService.profileUrl$);
  readonly orgMemberHasTitleOrDescription = toSignal(
    this._profileService.orgMemberHasTitleOrDescription$,
  );

  readonly appTitleContainer = computed(() => {
    const userName = this.userProfile()?.display_name || '';
    return { appTitle: environment.appTitle, userName };
  });
  readonly titleText = computed(() =>
    this.isProfileOwner()
      ? 'share-profile-modal.owner-title'
      : 'share-profile-modal.guest-title',
  );

  constructor(private readonly _profileService: ProfileService) {}
}
