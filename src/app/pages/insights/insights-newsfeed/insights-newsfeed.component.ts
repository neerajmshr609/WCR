import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import {
  filter,
  finalize,
  map,
  mergeMap,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  InsightsChannelEnum,
  NewsfeedQuestionType,
  PaymentSessionStatuses,
} from 'src/app/shared/enums';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Project } from 'src/app/shared/models/project.model';
import { RatebackEvt } from 'src/app/shared/models/rateback';
import { User } from 'src/app/shared/models/user.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { sortByRatingAndOrder } from 'src/app/shared/functions/sort-by-rating-and-order';
import { MENU_ITEMS } from './menu-items';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackSession } from 'src/app/shared/models/feedback-session';
import { TransactionsService } from 'src/app/services/transactions.service';
import { InsightsService } from 'src/app/services/insights.service';
import { IMenuItem } from '../../../main-content-menu/model/menu-item';

@Component({
  selector: 'app-insights-newsfeed',
  templateUrl: './insights-newsfeed.component.html',
  styleUrls: ['./insights-newsfeed.component.scss'],
})
export class InsightsNewsfeedComponent extends BaseComponent implements OnInit {
  @Input() public project: Project;

  activeInsightsChannel: InsightsChannelEnum;

  menuItems: IMenuItem[] = MENU_ITEMS;
  menuItem: IMenuItem;

  public currentUser: User;
  public insightsChannels = InsightsChannelEnum;
  public isLoading = true;
  public noContent: boolean;

  public itemDidReceiveRateback$ = new BehaviorSubject<RatebackEvt>(null);

  private inspiringFeedbacks: NewsfeedFeedback[] = [];
  private helpfulFeedbacks: NewsfeedFeedback[] = [];
  private unhelpfulFeedbacks: NewsfeedFeedback[] = [];
  private discouragingFeedbacks: NewsfeedFeedback[] = [];

  private strengthsFeedbacks: NewsfeedFeedback[] = [];
  private weaknessesFeedbacks: NewsfeedFeedback[] = [];
  private nextstepsFeedbacks: NewsfeedFeedback[] = [];
  private linksFeedbacks: NewsfeedFeedback[] = [];

  public feedbackSessions: FeedbackSession[] = [];
  public filteredFeedbackSessions: FeedbackSession[] = [];
  public usersThatGaveFeedback = new Array<number>();
  readonly paymentSessionStatuses = PaymentSessionStatuses;

  stripeDashboardLink$: Observable<string>;

  constructor(
    private newsfeedService: NewsfeedService,
    private activatedRoute: ActivatedRoute,
    private insigntsService: InsightsService,
    public authService: AuthService,
    private router: Router,
    private transactionsService: TransactionsService,
  ) {
    super();
  }

  public isAnon(userId: number) {
    return this.authService.isAnon(userId);
  }

  ngOnInit() {
    this.preselectMenuItem();

    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((user) => !!user),
        tap((user: User) => (this.currentUser = user)),
      )
      .subscribe();

    this.activeInsightsChannel =
      this.activatedRoute.snapshot.queryParams.channel ||
      this.insightsChannels.latest;

    this.newsfeedService
      .fetchFeedbackSessions(this.project.id)
      .pipe(
        tap((res) => {
          this.feedbackSessions.push(...res);
          this.feedbackSessions.forEach((f) =>
            this.parseFeedbacks(f.feedbacks),
          );
        }),
        mergeMap(() => {
          return forkJoin(
            this.feedbackSessions.map((session) => {
              const ratingId = session.feedbacks[0].rating_id;
              return this.newsfeedService
                .fetchFeedbacklanesForRating(ratingId)
                .pipe(
                  tap((res) => (this.insigntsService.lanes[ratingId] = res)),
                );
            }),
          );
        }),
        tap(() => {
          this.filteredFeedbackSessions = this.feedbackSessions.filter((s) => {
            return (
              (s.payment_request && !s.feedbacks.length) ||
              s.feedbacks.some((f) => {
                return (
                  f.newsfeed_question_type ===
                  NewsfeedQuestionType.feedback_rateback_stage
                );
              })
            );
          });

          this.filterFeedbacks(this.activeInsightsChannel);
        }),
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroyed),
      )
      .subscribe();

    this.transactionsService
      .fetchStripeDashboardLink()
      .pipe(takeUntil(this.destroyed))
      .subscribe();

    this.stripeDashboardLink$ =
      this.transactionsService.stripeDashboardLinks$.pipe(
        filter((res) => !!res),
        map((res) => res.billing_url),
        shareReplay(1),
      );
  }

  private parseFeedbacks(feedbacks: NewsfeedFeedback[]) {
    for (const feedback of feedbacks) {
      feedback.newsfeed_question_type = NewsfeedQuestionType.feedback;

      if (feedback.in_open_card_session) {
        feedback.newsfeed_question_type =
          NewsfeedQuestionType.feedback_rateback_stage;
        feedback.presenter_project = this.project;
      }

      switch (feedback.rateback_score) {
        case 5: {
          this.inspiringFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case 1: {
          this.helpfulFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case -1: {
          this.unhelpfulFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case -5: {
          this.discouragingFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
      }

      switch (feedback.feedbacktype) {
        case 'strengthsItems': {
          this.strengthsFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case 'weaknessesItems': {
          this.weaknessesFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case 'nextstepsItems': {
          this.nextstepsFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
        case 'linksItems': {
          this.linksFeedbacks.push(this.createFeedbackItem(feedback));
          break;
        }
      }
    }
  }

  private createFeedbackItem(feedback: NewsfeedFeedback) {
    return {
      ...feedback,
      newsfeed_question_type: NewsfeedQuestionType.feedback,
    };
  }

  private getUsersThatGaveFeedback(
    feedbacksForPresentationFiltered: NewsfeedFeedback[],
  ) {
    this.noContent = !feedbacksForPresentationFiltered.length;

    feedbacksForPresentationFiltered = feedbacksForPresentationFiltered.sort(
      (a, b) => b.id - a.id,
    );

    setTimeout(() => {
      this.usersThatGaveFeedback = Array.from(
        new Set(
          feedbacksForPresentationFiltered.map(
            (feedback) => feedback.commenter_id,
          ),
        ),
      );
      this.isLoading = false;
    });
  }

  public filterFeedbacks(channel: string) {
    this.project.insightscategory = channel;
    this.activeInsightsChannel = this.insightsChannels[channel];

    this.usersThatGaveFeedback = [];
    let feedbacksForPresentationFiltered: NewsfeedFeedback[] = [];

    switch (this.project.insightscategory) {
      case this.insightsChannels.inbox:
        this.isLoading = false;
        return;

      case this.insightsChannels.latest:
        feedbacksForPresentationFiltered = this.feedbackSessions
          .filter((s) => {
            return s.feedbacks.every(
              (f) =>
                f.newsfeed_question_type !==
                NewsfeedQuestionType.feedback_rateback_stage,
            );
          })
          .flatMap((f) => f.feedbacks)
          .sort(sortByRatingAndOrder);
        break;

      case this.insightsChannels.inspiring:
        feedbacksForPresentationFiltered = [...this.inspiringFeedbacks];
        break;

      case this.insightsChannels.helpful:
        feedbacksForPresentationFiltered = [...this.helpfulFeedbacks];
        break;

      case this.insightsChannels.unhelpful:
        feedbacksForPresentationFiltered = [...this.unhelpfulFeedbacks];
        break;

      case this.insightsChannels.discouraging:
        feedbacksForPresentationFiltered = [...this.discouragingFeedbacks];
        break;

      case this.insightsChannels.strengths:
        feedbacksForPresentationFiltered = [...this.strengthsFeedbacks];
        break;

      case this.insightsChannels.weaknesses:
        feedbacksForPresentationFiltered = [...this.weaknessesFeedbacks];
        break;

      case this.insightsChannels.nextsteps:
        feedbacksForPresentationFiltered = [...this.nextstepsFeedbacks];
        break;

      case this.insightsChannels.links:
        feedbacksForPresentationFiltered = [...this.linksFeedbacks];
        break;

      default:
        break;
    }

    this.getUsersThatGaveFeedback(feedbacksForPresentationFiltered);
  }

  public itemDidReceiveRateback(event: RatebackEvt) {
    this.itemDidReceiveRateback$.next(event);
  }

  private preselectMenuItem() {
    const param = this.activatedRoute.snapshot.queryParams.channel;
    const index = this.menuItems.findIndex((item) => item.param === param);
    this.menuItem = this.menuItems[index === -1 ? 0 : index];

    this.didSelectMenuItem(this.menuItem, true);
  }

  public didSelectMenuItem(item: IMenuItem, preselect: boolean = false): void {
    this.isLoading = true;

    if (preselect) {
      return;
    }

    this.filterFeedbacks(item.param);
  }

  public updateFeedbackSession(feedbackSession: FeedbackSession): void {
    const index: number = this.filteredFeedbackSessions.findIndex(
      (s) => s.id === feedbackSession.id,
    );
    this.parseFeedbacks(feedbackSession.feedbacks);
    this.filteredFeedbackSessions[index] = feedbackSession;
  }
}
