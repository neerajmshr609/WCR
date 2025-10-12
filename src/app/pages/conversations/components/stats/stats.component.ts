import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  AdvisorStats,
  StudentStats,
} from 'src/app/shared/models/conversations.model';
import { Review } from 'src/app/shared/models/review';
import { ConversationsService } from '../../services/conversations.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent extends BaseComponent implements OnInit {
  @Input() userId: number;
  @Input() advisorRate: number;
  @Input() feedbackPath$: BehaviorSubject<string>;
  @Input() stats: StudentStats | AdvisorStats;

  userType: string;
  expanded = false;

  reviews = new Array<Review>();
  selectedReview: Review;
  selectedReviewIndex = 0;
  selectedComment: string;

  constructor(private conversationsService: ConversationsService) {
    super();
  }

  expandMoreInfo(): void {
    this.expanded = !this.expanded;
  }

  public changeReview(direction: 1 | -1 | 0) {
    this.selectedReviewIndex += direction;
    this.selectedReview = this.reviews[this.selectedReviewIndex];
    this.selectedComment = this.selectedReview.positive_comment
      ? 'positive_comment'
      : 'negative_comment';
  }

  public switchComment(type: string) {
    this.selectedComment = type + '_comment';
  }

  ngOnInit(): void {
    this.conversationsService
      .fetchUserReviews()
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res.length),
        tap((res) => {
          res.forEach((el) => {
            Object.keys(el.instant_score).forEach((key) => {
              if (el.instant_score[key]) {
                el.instant_score[key] *= 10;
              }
            });
          });
          this.reviews = res;
          this.changeReview(0);
        }),
      )
      .subscribe();
  }
}
