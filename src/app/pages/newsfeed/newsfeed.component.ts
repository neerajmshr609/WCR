import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, forkJoin, Observable, of, Subscription } from 'rxjs';
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { SearchService } from 'src/app/services/search.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { NewsfeedQuestionType } from 'src/app/shared/enums';
import { NewsfeedFeedback } from 'src/app/shared/models/newsfeedfeedback.model';
import { Newsfeedfollow } from 'src/app/shared/models/newsfeedfollow.model';
import { Presenterquestion } from 'src/app/shared/models/presenterquestion.model';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { IMenuItem } from '../../main-content-menu/model/menu-item';
import { TypingCardConfig } from '../../shared/components/typing-card/typing-card.component';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss'],
})
export class NewsfeedComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public currentUser: User;
  public noContent = true;
  public isLoading = true;
  public isMobile: boolean;
  public readonly typingCardConfig: TypingCardConfig = {
    bgColor: '#424D51',
    fontSizes: {
      en: [40, 50],
      de: [40, 50],
      ru: [36, 46],
      uk: [36, 46],
    },
    repeat: true,
    textColor: '#FFCC34',
    textColorSecond: '#FFFFFF',
  };

  private currentMediatypes = new Array<string>();
  public selectedCategories = new Array<number>();

  public feedbacksForPresentation: NewsfeedFeedback[];

  private page = 0;
  private canScroll = true;

  private loadedFeedbacks: NewsfeedFeedback[];
  private feedbacksLength: number;
  private loadedChooseTheBest: Project[];
  private chooseTheBestLength: number;
  private loadedPresenterQuestions: Presenterquestion[];
  private presenterQuestionsLength: number;

  private subscription = new Subscription();

  public menuItems: IMenuItem[] = [
    {
      title: 'menu.latest',
      param: '',
    },
    {
      title: 'menu.following',
      param: 'following',
    },
    {
      title: 'menu.stay_tuned',
      disabled: true,
      param: 'stay_tuned',
    },
  ];
  public menuItem: IMenuItem;

  public columnsCount = 3;
  public cards = [[], [], []];

  constructor(
    private newsfeedService: NewsfeedService,
    private searchService: SearchService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) {
    super();
  }

  ngOnInit() {
    this.searchService.currentPage$.next('publicfeed');
    this.preselectMenuItem();
    this.subscribeToUser();
    this.observeBreakpoint();
    this.loadFeed();
    this.reinitColumns();
  }

  private preselectMenuItem() {
    const param = this.route.snapshot.queryParams.type;
    const index = this.menuItems.findIndex((item) => item.param === param);
    this.menuItem = this.menuItems[index === -1 ? 0 : index];
  }

  public didSelectMenuItem(index: number) {
    this.menuItem = this.menuItems[index];

    this.router.navigate([], {
      replaceUrl: true,
      queryParams: {
        type: this.menuItem.param || null,
      },
    });

    this.loadByType();
  }

  public loadMore() {
    if (
      !this.canScroll ||
      !this.feedbacksForPresentation?.length ||
      this.menuItem.param
    ) {
      return;
    }

    this.fetchCards();
  }

  private reinitColumns() {
    this.cards = [];

    for (let i = 0; i < this.columnsCount; i++) {
      this.cards.push([]);
    }

    for (let i = 0; i < this.feedbacksForPresentation?.length; i++) {
      this.cards[i % this.columnsCount].push(this.feedbacksForPresentation[i]);
    }
  }

  private getFeedbacksForPresentation() {
    const newArr = [
      ...this.loadedFeedbacks.slice(0, 5),
      ...this.loadedChooseTheBest.slice(0, 1),
      ...this.loadedPresenterQuestions.slice(0, 1),
      ...this.loadedFeedbacks.slice(5, 10),
      ...this.loadedChooseTheBest.slice(1, 2),
      ...this.loadedPresenterQuestions.slice(1, 2),
    ];
    this.feedbacksForPresentation.push(...newArr);

    for (let i = 0; i < newArr.length; i++) {
      this.cards[i % this.columnsCount].push(newArr[i]);
    }

    if (this.cards.length > 1) {
      const lengths = this.cards.map((arr) => arr.length);
      lengths[0]++; // because of the intro card
      if (lengths.every((length) => length === lengths[0])) {
        return;
      }
      const smallest = lengths.indexOf(Math.min(...lengths));
      const biggest = lengths.indexOf(Math.max(...lengths));
      const item = this.cards[biggest].pop();
      this.cards[smallest].push(item);
    }

    this.cdr.detectChanges();
  }

  private observeBreakpoint() {
    this.breakpointObserver
      .observe([
        '(max-width: 1180px)',
        '(max-width: 1279px)',
        '(max-width: 819px)',
      ])
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => {
          const columnsCount = this.columnsCount;
          this.isMobile = res.breakpoints['(max-width: 1180px)'];

          if (res.breakpoints['(max-width: 819px)']) {
            this.columnsCount = 1;
          } else if (res.breakpoints['(max-width: 1279px)']) {
            this.columnsCount = 2;
          } else {
            this.columnsCount = 3;
          }

          if (this.columnsCount !== columnsCount) {
            this.reinitColumns();
          }
        }),
      )
      .subscribe();
  }

  private subscribeToUser() {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((user) => !!user),
        tap((user: User) => (this.currentUser = user)),
      )
      .subscribe();
  }

  private loadByType() {
    if (this.menuItem.param === 'following') {
      this.didMenuSelectNewsfeedFollowing();
    } else {
      this.didMenuSelectNewsfeed();
    }
  }

  private loadFeed() {
    merge(
      this.searchService.selectedMediatypes$,
      this.searchService.selectedCategories$,
    )
      .pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.page = 0;
          this.feedbacksForPresentation = [];
          this.currentMediatypes = this.searchService.selectedMediatypes$.value;
          this.selectedCategories =
            this.searchService.selectedCategories$.value.map((item) => item.id);
          this.loadByType();
        }),
      )
      .subscribe();
  }

  private fetchNewsfeedFollows(): Observable<Newsfeedfollow[]> {
    return this.newsfeedService
      .fetchNewsfeedfollows()
      .pipe(tap((follows) => (this.feedbacksForPresentation = follows)));
  }

  private fetchCards(): void {
    this.subscription?.unsubscribe();
    this.isLoading = true;
    this.canScroll = false;

    const calls = [
      this.fetchFeedbacksForMediaTypes(),
      this.fetchChooseTheBest(),
      this.fetchPresenterQuestions(),
    ];

    this.subscription = forkJoin(calls)
      .pipe(
        finalize(() => {
          this.canScroll = true;
          this.noContent = false;
          this.isLoading = false;
        }),
        tap(() => {
          this.getFeedbacksForPresentation();
          this.page++;
        }),
      )
      .subscribe();
  }

  private fetchFeedbacksForMediaTypes(): Observable<NewsfeedFeedback[]> {
    if (this.page * 5 > this.feedbacksLength) {
      this.loadedFeedbacks = [];
      return EMPTY;
    }

    return this.newsfeedService
      .fetchFeedbacksForMediaType(
        this.currentMediatypes,
        this.selectedCategories,
        this.page,
      )
      .pipe(
        tap((res) => (this.feedbacksLength = res.total_count)),
        map((res) => res.data),
        tap((res) => this.parseFeedbacksForNewsfeed(res)),
      );
  }

  private fetchChooseTheBest(): Observable<Project[]> {
    if (this.page * 2 > this.chooseTheBestLength) {
      this.loadedChooseTheBest = [];
      return EMPTY;
    }

    return this.newsfeedService
      .fetchChoosethebest(this.page, this.selectedCategories)
      .pipe(
        tap((res) => (this.chooseTheBestLength = res.total_count)),
        map((res) => res.data),
        tap((projects) => this.parseChooseTheBestForNewsfeed(projects)),
      );
  }

  private fetchPresenterQuestions(): Observable<Presenterquestion[]> {
    if (this.page * 2 > this.presenterQuestionsLength) {
      this.loadedPresenterQuestions = [];
      return EMPTY;
    }

    return this.newsfeedService
      .fetchPresenterQuestions(
        this.currentMediatypes,
        this.page,
        this.selectedCategories,
      )
      .pipe(
        tap((res) => (this.presenterQuestionsLength = res.total_count)),
        map((res) => res.data),
        tap((questions) => this.parsePresenterQuestionsForNewsfeed(questions)),
      );
  }

  private parseChooseTheBestForNewsfeed(projects) {
    this.loadedChooseTheBest = [];

    for (const project of projects) {
      this.createChooseTheBestForProject(project, this.loadedChooseTheBest);
    }
  }

  private parsePresenterQuestionsForNewsfeed(questions: Presenterquestion[]) {
    this.loadedPresenterQuestions = [];

    for (const question of questions) {
      this.createPresenterQuestionFromQuestion(question);
    }
  }

  private parseFeedbacksForNewsfeed(feedbacks: NewsfeedFeedback[]) {
    this.loadedFeedbacks = [];
    feedbacks.forEach((item) => this.createFeedbackObject(item));
  }

  private allMediatypesAreSelected() {
    const possibleTypes = ['audio', 'video', 'image'];

    if (!this.currentMediatypes.length) {
      this.currentMediatypes = possibleTypes;
    }

    return this.currentMediatypes.length === 3;
  }

  private createFeedbackObject(item: NewsfeedFeedback): void {
    const methods = [];

    if (item.feedbacktype !== 'linksItems') {
      methods.push(1);
    }

    if (item.avratingparam_id) {
      methods.push(3);
    }

    if (item.rateback_score && Math.random() < 0.1) {
      this.loadedFeedbacks.push(
        this.createFeedbackCardFromFeedbackItem(
          item,
          NewsfeedQuestionType.guess_rateback,
        ),
      );
      return;
    }

    const method = methods[Math.floor(Math.random() * methods.length)];

    switch (method) {
      case 1:
        this.loadedFeedbacks.push(
          this.createFeedbackCardFromFeedbackItem(
            item,
            NewsfeedQuestionType.guess_feedback_category,
          ),
        );
        break;
      case 3:
        this.loadedFeedbacks.push(
          this.createFeedbackCardFromFeedbackItem(
            item,
            NewsfeedQuestionType.guess_comment_lane,
          ),
        );
        break;
    }
  }

  private createPresenterQuestionFromQuestion(
    presenterQuestion: Presenterquestion,
  ): void {
    if (
      (this.currentMediatypes &&
        presenterQuestion.project.projectfiles.filter((obj) =>
          this.currentMediatypes.includes(obj.kind),
        ).length) ||
      this.allMediatypesAreSelected()
    ) {
      const presenter = new NewsfeedFeedback();
      presenter.newsfeed_question_type =
        NewsfeedQuestionType.presenter_question;
      presenter.presenter_project = presenterQuestion.project;

      presenter.presenter_project.presenterquestion = presenterQuestion.title;
      presenter.presenter_question_id = presenterQuestion.id;

      presenter.projectfile_id = +presenter.presenter_project.id + 100000;
      presenter.project_category = presenterQuestion.project.category_name;
      presenter.project_sharetoken = presenterQuestion.project.sharetoken;

      presenter.artist_id = presenterQuestion.project.user.id;
      this.loadedPresenterQuestions.push(presenter);
    }
  }

  private createChooseTheBestForProject(
    project: Project,
    array: NewsfeedFeedback[],
  ): void {
    if (
      (this.currentMediatypes &&
        project.projectfiles.filter((obj) =>
          this.currentMediatypes.includes(obj.kind),
        ).length) ||
      this.allMediatypesAreSelected()
    ) {
      if (project.projectfiles.length > 1) {
        const ctb = new NewsfeedFeedback();
        ctb.newsfeed_question_type = NewsfeedQuestionType.choose_the_best;
        ctb.choose_the_best_project = project;
        ctb.projectfile_id = ctb.choose_the_best_project.id + 100000;
        ctb.project_category = project.category_name;
        ctb.project_sharetoken = project.sharetoken;
        ctb.artist_id = project.user_id;

        array.push(ctb);
      }
    }
  }

  private createFeedbackCardFromFeedbackItem(
    item: NewsfeedFeedback,
    type: NewsfeedQuestionType,
  ): NewsfeedFeedback {
    return {
      ...item,
      newsfeed_question_type: type,
    };
  }

  public didMenuSelectNewsfeed() {
    this.resetData();
    this.fetchCards();
  }

  public didMenuSelectNewsfeedFollowing() {
    this.resetData();
    this.isLoading = false;
  }

  private resetData() {
    this.page = 0;
    this.feedbacksForPresentation = [];
    this.reinitColumns();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.searchService.currentPage$.next(null);
    this.subscription?.unsubscribe();
  }
}
