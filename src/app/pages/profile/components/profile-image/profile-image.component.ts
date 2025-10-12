import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileImageUploaderService } from '../../services/profile-image-uploader.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImageComponent implements OnInit, OnDestroy {
  readonly publicProfile = toSignal(this._profileService.publicProfile$);
  readonly isProfileOfCurrentUser = toSignal(
    this._profileService.isProfileOwner$,
  );
  public isUploaderOpened = signal(false);

  readonly userProfileImage = computed(() => {
    const profile = this.publicProfile();
    const src = profile?.profileimage || '';
    const alt = `Profile Image of ${profile?.display_name || ''}`;
    return { src, alt };
  });

  readonly UPLOADER_CONTAINER_CLASSNAME =
    this._profileImageUploaderService.UPLOADER_CONTAINER_CLASSNAME;

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _profileImageUploaderService: ProfileImageUploaderService,
  ) {}

  ngOnDestroy(): void {
    this._profileImageUploaderService.destroyUppy();
    this.isUploaderOpened.set(false);
  }

  openUploader(): void {
    this.isUploaderOpened.set(true);
    setTimeout(() => {
      this._profileImageUploaderService.openUploader();
    });
  }

  public closeUploader(): void {
    this._profileImageUploaderService.destroyUppy();
    this.isUploaderOpened.set(false);
  }

  ngOnInit(): void {
    this._profileImageUploaderService.uploadFinished$.subscribe(() => {
      this.closeUploader();
    });
  }
}
