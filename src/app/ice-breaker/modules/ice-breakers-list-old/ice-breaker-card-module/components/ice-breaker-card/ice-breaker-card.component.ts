import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  UserSkill,
  UserSkillReview,
} from '../../../../../../shared/models/UserSkill.model';
import {
  IceBreaker,
  IceBreakerType,
} from '../../../../ice-breaker-template/ice-breaker-template-messages';
import { User } from '../../../../../../shared/models/user.model';
import { InformModalComponent } from './inform-modal/inform-modal.component';
import { ShareIceBreakerModalComponent } from '../share-ice-breaker-modal/share-ice-breaker-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { PROFILE_PATH } from '../../../../../../pages/profile/routing/profile.paths';
import { ICE_BREAKER_PATH } from '../../ice-breakers.path';

@Component({
  selector: 'app-ice-breaker-card',
  templateUrl: './ice-breaker-card.component.html',
  styleUrls: ['./ice-breaker-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IceBreakerCardComponent implements OnChanges {
  state: 'selectSkill' | 'Create' | 'Created' | 'Buy' | 'Payed' = 'selectSkill';
  userSkill: UserSkill;
  user: User;
  userIceBreaker: IceBreaker;
  reviews: UserSkillReview[] = [];
  selectedReviewIndex: number;
  selectedReview: UserSkillReview;
  selectedComment: string;

  @Input() selectedSkill: UserSkill;
  @Input() currentUser: User;
  @Input() publicProfile: User;
  @Input() payed = false;
  @Input() iceBreakerData: IceBreaker;
  @Input() index = 1;
  @Input() isLoading = false;

  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Output() join: EventEmitter<IceBreaker> = new EventEmitter<IceBreaker>();
  @Output() onPriceChanged: EventEmitter<number> = new EventEmitter<number>();
  shareLink: string;
  readonly ICE_BREAKER_TYPES = IceBreakerType;

  constructor(
    private dialog: MatDialog,
    private readonly translateService: TranslateService,
    @Inject(DOCUMENT)
    private readonly _appDocument: Document,
  ) {}

  ngOnChanges() {
    const isOwner = this.currentUser?.id === this.publicProfile.id;
    if (!this.selectedSkill && isOwner && !this.iceBreakerData) {
      this.state = 'selectSkill';
      return;
    }
    if (this.iceBreakerData) {
      this.shareLink = `${this._appDocument.location.origin}/${PROFILE_PATH}/${this.publicProfile.sharetoken}/${ICE_BREAKER_PATH}?id=${this.iceBreakerData.id}`;
    }
    if (isOwner && this.iceBreakerData) {
      const { user_skill_id: iceBreakerUserSkillId } = this.iceBreakerData;
      this.userSkill = this.publicProfile.user_skills.find(
        (userSkill: UserSkill) => userSkill.id === iceBreakerUserSkillId,
      );
      this.state = 'Created';
      this.updateReviews();
      return;
    }
    if (this.selectedSkill && isOwner && !this.iceBreakerData) {
      this.state = 'Create';
      this.user = this.currentUser;
      this.userSkill = this.selectedSkill;
      this.updateReviews();
      return;
    }
    if (!isOwner && this.iceBreakerData?.icebreaker_member?.conversation_id) {
      this.state = 'Payed';
      this.userIceBreaker = this.iceBreakerData;
      this.userSkill = this.publicProfile.user_skills.find(
        (userSkill: UserSkill) =>
          userSkill.id === this.iceBreakerData.user_skill_id,
      );
      this.updateReviews();
      return;
    }

    if (!isOwner && !this.payed) {
      this.userIceBreaker = this.iceBreakerData;
      this.userSkill = this.publicProfile.user_skills.find(
        (userSkill: UserSkill) =>
          userSkill.id === this.iceBreakerData.user_skill_id,
      );
      this.updateReviews();
      this.state = 'Buy';
      return;
    }
  }

  deleteIceBreaker(): void {
    this.delete.emit(this.iceBreakerData.id);
  }

  joinToIceBreaker(iceBreaker: IceBreaker): void {
    this.join.emit(iceBreaker);
  }

  updateReviews() {
    this.reviews =
      this.userSkill?.reviews.filter(
        (review) => review.positive_comment || review.negative_comment,
      ) || [];
    if (this.reviews.length) {
      this.selectedReviewIndex = 0;
      this.selectedReview = this.reviews[this.selectedReviewIndex];
      this.selectedComment = this.selectedReview.positive_comment
        ? 'positive_comment'
        : 'negative_comment';
    }
  }

  changeReview(direction: 1 | -1) {
    this.selectedReviewIndex += direction;
    this.selectedReview = this.reviews[this.selectedReviewIndex];
    this.selectedComment = this.selectedReview.positive_comment
      ? 'positive_comment'
      : 'negative_comment';
  }

  switchComment(type: string) {
    this.selectedComment = type + '_comment';
  }

  openComingSoon(): void {
    this.dialog.open(InformModalComponent, {
      maxWidth: '363px',
      width: '100%',
      data: {
        imgSrc: '/assets/ice-breaker/emoji.svg',
        headerText: 'Icebreaker Sessions are live next week.',
        footerText:
          'Until then select your own skills and create your own Icebreakers!',
      },
    });
  }

  shareIceBreaker(title: string): void {
    this.dialog.open(ShareIceBreakerModalComponent, {
      width: '100%',
      maxWidth: '400px',
      data: {
        shareLink: this.shareLink,
        title,
        userName: this.publicProfile.display_name,
      },
    });
  }

  priceChanged(price: number) {
    this.onPriceChanged.emit(price);
  }

  openSelectSkillModal(): void {
    this.dialog.open(InformModalComponent, {
      maxWidth: '363px',
      width: '100%',
      data: {
        imgSrc: '/assets/ice-breaker/select-skill.png',
        headerText: this.translateService.instant(
          'ice-breaker-card.pick-topic',
        ),
        footerText: this.translateService.instant(
          'ice-breaker-card.if-you-have',
        ),
      },
    });
  }
}
