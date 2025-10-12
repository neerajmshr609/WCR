import { Component, effect, input, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { User } from 'src/app/shared/models/user.model';
import { ProfileService } from '../../services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserProfileSkillsService } from '../../services/user-profile-skills.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UploaderService],
})
export class ProfileComponent extends BaseComponent implements OnDestroy {
  readonly profileToken = input<string>();
  user: User;
  currentUser: User;
  readonly publicProfile = toSignal(this._profileService.publicProfile$);
  readonly isLoading = toSignal(this._profileService.loadingState.isLoading$);

  // isDisplayIceBreakers$ = combineLatest([
  //   this._authService.userSubject$,
  //   this.profileStore.publicProfile$,
  // ]).pipe(
  //   map(([currentUser, publicProfile]: [User, User]) => {
  //     if (currentUser?.id === publicProfile.id) {
  //       return true;
  //     }
  //     if (publicProfile.icebreakers?.length) {
  //       return true;
  //     }
  //     return false;
  //   }),
  // );

  // @ViewChild('profileImage', { static: false }) profileImage: ElementRef;

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _userProfileSkillsService: UserProfileSkillsService,
  ) {
    super();

    effect(
      () => {
        this._profileService.fetchProfile(this.profileToken());
      },
      { allowSignalWrites: true },
    );
  }

  // toggleVisibility(project: Project) {
  //   project.private = !project.private;
  //   this.projectService.updateProject(project).subscribe();
  // }
  //
  // pickProfileSkill(skill: UserSkill): void {
  //   this.profileStore.pickSkill(skill);
  // }
  //
  // private becomeAdvisorModal(): void {
  //   this.dialog.open(BecomeAdvisorModalComponent, {
  //     panelClass: 'modal',
  //   });
  // }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._profileService.clearPublicProfile();
    this._userProfileSkillsService.clearSelectedSkill();
  }
}
