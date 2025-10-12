import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileIceBreaker } from '../../../../model/user-profile-ice-breaker.model';
import { TranslateModule } from '@ngx-translate/core';
import { IconRenderComponent } from '@icons/_base/icon-render/icon-render.component';
import { ReviewScoreComponent } from '@ui-components/review-score/review-score.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { AdvisorProfileUserSkill } from '../../../../model/advisor-profile-user-skill.model';
import { ButtonComponent } from '@ui-kit/button/button.component';
import { IceBreakerService } from '../../../../../../ice-breaker/service/ice-breaker.service';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CAPSULE_CHILD_PATH } from 'src/app/pages/profile/routing/profile.paths';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileSkillsService } from 'src/app/pages/profile/services/user-profile-skills.service';
import { IceBreakerCardMenuComponent } from '../ice-breaker-card-menu/ice-breaker-card-menu.component';

@Component({
  selector: 'app-ice-breakers-list-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconRenderComponent,
    ReviewScoreComponent,
    SharedModule,
    ButtonComponent,
    IceBreakerCardMenuComponent,
  ],
  templateUrl: './ice-breakers-list-card.component.html',
  styleUrls: ['./ice-breakers-list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IceBreakersListCardComponent implements AfterViewInit {
  readonly iceBreaker = input<UserProfileIceBreaker>();
  readonly userSkill = input.required<AdvisorProfileUserSkill>();
  readonly isOwner = input(false);
  readonly scrollToCard = input(false);
  readonly skill = computed(() => this.userSkill()?.skill);
  readonly number = computed(() =>
    typeof this.iceBreaker()?.index === 'number'
      ? `#${this.iceBreaker()?.index}`
      : '',
  );
  readonly icebreakerTitle = computed(() => this.iceBreaker()?.title);
  readonly icon = computed(() => this.skill()?.icon);
  readonly totalReviews = computed(() => this.userSkill()?.reviews.length);
  readonly score = computed(() => this.userSkill()?.overall_skill_score);
  readonly description = computed(() => {
    const iceBreaker = this.iceBreaker();
    return this.isOwner() && !iceBreaker
      ? 'ice-breakers-list-card.create-description'
      : iceBreaker?.description || '';
  });
  readonly btnText = computed(() =>
    !!this.iceBreaker()
      ? 'ice-breakers-list-card.enter-chat-capsule'
      : 'ice-breakers-list-card.create-new-capsule',
  );

  readonly maxScore = AdvisorProfileUserSkill.MAX_OVERALL_SKILL_SCORE;
  private readonly _userIsSignedIn = toSignal(
    this._authService.userIsSignedIn$,
  );
  readonly allowReview = computed(
    () => !this.isOwner() && this._userIsSignedIn(),
  );
  private readonly _profileUrl = toSignal(this._profileService.profileUrl$);

  readonly dropdownItems = [
    {
      title: 'Delete',
      param: 'delete',
      action: () => {
        this._profileService.deleteIceBreaker(this.iceBreaker()?.id);
      },
    },
  ] as const;

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _iceBreakerService: IceBreakerService,
    private readonly _skillsService: UserProfileSkillsService,
    private readonly _elementRef: ElementRef,
    private readonly _authService: AuthService,
  ) {}

  ngAfterViewInit(): void {
    this._scrollToCard();
  }

  private _scrollToCard() {
    if (this.scrollToCard()) {
      const { offsetTop, clientHeight } = this._elementRef.nativeElement;
      const top = offsetTop - clientHeight * 0.2;
      scrollTo({ top, behavior: 'smooth' });
    }
  }

  async createNewChat() {
    if (!this.isOwner() && this.iceBreaker()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await firstValueFrom(this._iceBreakerService.join(this.iceBreaker()));
    }
  }
  openShareIceBreakerModal() {
    if (!this.iceBreaker()) {
      return;
    }
    const iceBreakerUrl = [
      this._profileUrl(),
      CAPSULE_CHILD_PATH.toRelativeUrl({ capsuleId: this.iceBreaker().id }),
    ].join('/');

    this._iceBreakerService.openShareIceBreakerModal({
      iceBreakerUrl,
      titleText: this.icebreakerTitle(),
      skillIcon: { icon: this.icon() },
      skillName: this.skill()?.name,
    });
  }

  async createNewIceBreaker() {
    const selectedSkill = await firstValueFrom(
      this._skillsService.selectedUserSkill$,
    );
    if (selectedSkill) {
      await this._iceBreakerService.initIceBreakerCreation(
        selectedSkill.skill.name,
        selectedSkill.id,
      );
    }
  }
}
