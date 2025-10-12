import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-info-languages',
  templateUrl: './profile-info-languages.component.html',
  styleUrls: ['./profile-info-languages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoLanguagesComponent {
  private readonly _userProfile = toSignal(this._profileService.publicProfile$);
  readonly languages = computed(() => this._userProfile().languages || []);

  constructor(
    private readonly _profileService: ProfileService
  ) {
  }
}
