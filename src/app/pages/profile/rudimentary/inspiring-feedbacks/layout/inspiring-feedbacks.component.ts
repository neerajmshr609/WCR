import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { NewsfeedQuestionType } from 'src/app/shared/enums';
import { NewsfeedService } from 'src/app/services/newsfeed.service';

@Component({
  selector: 'app-inspiring-feedbacks',
  templateUrl: './inspiring-feedbacks.component.html',
  styleUrls: ['./inspiring-feedbacks.component.scss'],
})
export class InspiringFeedbacksComponent
  extends BaseComponent
  implements OnInit
{
  usersFeedbacks$: Observable<NewsfeedFeedback[]>;

  constructor(
    private authService: AuthService,
    private newsfeedService: NewsfeedService,
  ) {
    super();
  }

  createFeedbackItemAndScore(userFeedback: NewsfeedFeedback): NewsfeedFeedback {
    return {
      ...userFeedback,
      newsfeed_question_type: NewsfeedQuestionType.feedback,
      userFeedbacksResorts:
        userFeedback.feedbacktype === 'resortItems' ? [userFeedback] : [],
      userFeedbacksStrengths:
        userFeedback.feedbacktype === 'strengthsItems' ? [userFeedback] : [],
      userFeedbacksWeaknesses:
        userFeedback.feedbacktype === 'weaknessesItems' ? [userFeedback] : [],
      userFeedbacksNextsteps:
        userFeedback.feedbacktype === 'nextstepsItems' ? [userFeedback] : [],
      userFeedbacksLinks:
        userFeedback.feedbacktype === 'linksItems' ? [userFeedback] : [],
    };
  }

  getInspiringFeedbacks(userId: number) {
    return this.newsfeedService
      .fetchInspiringFeedbacksForUserID(userId)
      .pipe(
        map((res) => res.map((item) => this.createFeedbackItemAndScore(item))),
      );
  }

  ngOnInit(): void {
    this.usersFeedbacks$ = this.authService.userProfileInfo$.pipe(
      switchMap((res) => this.getInspiringFeedbacks(res.id)),
      takeUntil(this.destroyed),
    );
  }
}
