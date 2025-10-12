import { Injectable } from '@angular/core';
import { UploaderService } from '../../../shared/components/uploader/uploader';
import { AuthService } from '../../../auth/auth.service';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import { LoadingState } from '../../../shared/lib/loading-state';
import { isNotAnyOf } from '../../../shared/lib/rx-js.helpers';
import { filter, map, take, tap } from 'rxjs/operators';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'any',
})
export class ProfileImageUploaderService {
  private static readonly _uploaderOptions = {
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
    },
  } as const;
  readonly UPLOADER_CONTAINER_CLASSNAME = 'uploader--profile-cover';

  private readonly _isModalOpened$ = new BehaviorSubject(false);
  readonly isModalOpened$ = this._isModalOpened$.asObservable();
  readonly loadingState = new LoadingState();
  readonly uploadFinished$ =
    this._uploaderService.uploadFinished.asObservable();

  constructor(
    private readonly _authService: AuthService,
    private readonly _profileService: ProfileService,
    private readonly _uploaderService: UploaderService,
  ) {
    this._uploaderService.uploaderConfig = {
      id: this.UPLOADER_CONTAINER_CLASSNAME,
      target: this.UPLOADER_CONTAINER_CLASSNAME,
      inline: true,
    };
    // this._uploaderService.init();
  }

  private _setUploadModalOpened() {
    this._isModalOpened$.next(true);
  }

  private _setUploadModalClosed() {
    this._isModalOpened$.next(false);
  }

  openUploader() {
    isNotAnyOf(this.isModalOpened$, this.loadingState.isLoading$)
      .pipe(
        tap(() => {
          this._uploaderService.init();
        }),
        switchMap(() => this._openUploaderModal()),
        map((uploadResult) =>
          decodeURIComponent(uploadResult.successful[0].uploadURL),
        ),
        switchMap((imageSrc) =>
          this._authService.updateAuthorizedUser({ profileimage: imageSrc }),
        ),
      )
      .subscribe((shat) => {
        this._profileService.reloadUserPublicProfile();
      });
  }

  destroyUppy() {
    this._uploaderService.destroy();
  }

  private _openUploaderModal() {
    return this._userProfileImageFolder().pipe(
      switchMap((profileImageFolder) => {
        // this._setUploadModalOpened();
        this._uploaderService.meta = { folder: profileImageFolder };
        this._uploaderService.options =
          ProfileImageUploaderService._uploaderOptions;
        return from(this._uploaderService.uploadFinished).pipe(take(1));
      }),
    );
  }

  private _userProfileImageFolder() {
    return this._authService.authorizedUser$.pipe(
      take(1),
      map((authorizedUser) => {
        return authorizedUser ? `users/${authorizedUser.id}/profile` : null;
      }),
      filter((_) => !!_),
    );
  }
}
