import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { OnboardingModalComponent } from 'src/app/shared/components/onboarding-modal/onboarding-modal.component';
import {
  UserSkill,
  UserSkillReview,
} from 'src/app/shared/models/UserSkill.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { SelfContactErrorModalComponent } from '../../self-contact-error-modal/self-contact-error-modal.component';

@Component({
  selector: 'app-skill-card-list-item',
  templateUrl: './skill-card-list-item.component.html',
  styleUrls: ['./skill-card-list-item.component.scss'],
})
export class SkillCardListItemComponent
  extends BaseComponent
  implements OnInit
{
  @Output() selectionStateChange = new EventEmitter<boolean>();

  @Input() unselect$: BehaviorSubject<UserSkill>;
  @Input() selectedUserSkill$: BehaviorSubject<UserSkill>;
  @Input() isDetailPresentation;
  @Input() userSkill: UserSkill;
  @Input() advisorId: number;
  @Input() currentUserId: number;
  @Input() isShowRatingScoreGraph = true;

  isSelected = false;

  reviews = new Array<UserSkillReview>();
  selectedReview: UserSkillReview;
  selectedReviewIndex: number;
  selectedComment: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedUserSkill$
      ?.pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        tap((res) => this.updateUserSkill(res)),
      )
      .subscribe();

    this.unselect$
      ?.pipe(
        takeUntil(this.destroyed),
        filter((res) => res.id !== this.userSkill.id),
        tap(() => (this.isSelected = false)),
      )
      .subscribe();
  }

  updateUserSkill(skill) {
    this.userSkill = skill;
    this.updateReviews();
    this.cdRef.detectChanges();
  }

  updateReviews() {
    this.reviews = this.userSkill.reviews.filter(
      (review) => review.positive_comment || review.negative_comment,
    );
    if (this.reviews.length) {
      this.selectedReviewIndex = 0;
      this.selectedReview = this.reviews[this.selectedReviewIndex];
      this.selectedComment = this.selectedReview.positive_comment
        ? 'positive_comment'
        : 'negative_comment';
    }
  }

  toggleSelected() {
    if (this.isDetailPresentation) {
      return;
    }

    if (!this.currentUserId) {
      this.dialog.open(OnboardingModalComponent, {
        maxWidth: '92vw',
        width: '360px',
        maxHeight: '92vh',
        height: '760px',
        autoFocus: false,
        panelClass: 'modal',
        data: { step: 5 },
      });
      return;
    }

    if (this.advisorId === this.currentUserId) {
      this.dialog.open(SelfContactErrorModalComponent, {
        maxWidth: '350px',
        width: '100vw',
        maxHeight: '82vh',
        height: '450px',
        autoFocus: false,
        panelClass: 'modal',
      });
      return;
    }

    this.isSelected = !this.isSelected;
    this.selectionStateChange.emit(this.isSelected);
  }

  public changeReview(direction: 1 | -1) {
    this.selectedReviewIndex += direction;
    this.selectedReview = this.reviews[this.selectedReviewIndex];
    this.selectedComment = this.selectedReview.positive_comment
      ? 'positive_comment'
      : 'negative_comment';
  }

  public switchComment(type: string) {
    this.selectedComment = type + '_comment';
  }
}
