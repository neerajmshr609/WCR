import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { filter, finalize, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { SearchService } from 'src/app/services/search.service';
import { MENU_ITEMS } from './menu-items';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Point } from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth/auth.service';
import { RateflowService } from 'src/app/services/rateflow.service';

@Component({
  selector: 'app-creatives',
  templateUrl: './creatives.component.html',
  styleUrls: ['./creatives.component.scss'],
})
export class CreativesComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public currentUser: User;
  public isLoading: boolean;
  public isSmallScreen: boolean;

  readonly menuItems = MENU_ITEMS;

  public isInDraftsSection = false;
  public isInReviewQueueSection = false;
  public projects$ = new BehaviorSubject<Project[]>(null);
  private subscription = new Subscription();

  public selectedCategories: number[];
  public selectedMediatypes: string[];

  private page = 0;
  private canScroll = true;
  private length: number;

  public coordinates: Point;
  private isCoordinatesSort: boolean;

  constructor(
    private projectService: ProjectService,
    private searchService: SearchService,
    private rateflowService: RateflowService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private observer: BreakpointObserver,
    public authService: AuthService,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.authService.userSubject$
      .pipe(
        tap((user) => {
          this.currentUser = user;
          this.cdRef.detectChanges();
        }),
        filter((res) => !!res),
        mergeMap(() => this.rateflowService.getDrafts()),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.searchService.currentPage$.next('creatives');
    // this.preselectMenuItem();
    this.loadPage();
    this.observeBreakpoint();
    this.getDrafts();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.searchService.currentPage$.next(null);
  }

  private getDrafts() {
    if (!this.authService.userIsSignedIn()) {
      return;
    }

    this.rateflowService
      .getDrafts()
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  private observeBreakpoint() {
    this.observer
      .observe('(max-width: 1180px)')
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.isSmallScreen = res.matches)),
      )
      .subscribe();
  }

  private loadPage() {
    merge(
      this.searchService.selectedMediatypes$,
      this.searchService.selectedCategories$,
    )
      .pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.selectedMediatypes =
            this.searchService.selectedMediatypes$.value;
          this.selectedCategories =
            this.searchService.selectedCategories$.value.map((item) => item.id);
          this.resetProjects();
          this.loadProjects();
        }),
      )
      .subscribe();
  }

  public loadMore() {
    if (!this.canScroll) {
      return;
    }

    this.canScroll = false;
    this.cdRef.detectChanges();
    this.page++;

    this.loadProjects();
  }

  private loadProjects() {
    if (
      (this.isInReviewQueueSection || this.isInDraftsSection) &&
      !this.authService.userIsSignedIn()
    ) {
      return;
    }

    if (this.page && !Math.floor(this.length / (this.page * 10))) {
      return;
    }

    this.isLoading = true;
    this.canScroll = false;
    this.subscription.unsubscribe();
    const allProjects = this.projects$.value || [];
    const sort = 'feedback_focus_area';
    const coordinates = this.isCoordinatesSort ? this.coordinates : null;

    this.subscription = this.projectService
      .fetchCreativesProjects(
        sort,
        this.page,
        this.selectedCategories,
        this.selectedMediatypes,
        coordinates,
      )
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => {
          this.length = res.total_count;
          allProjects.push(...res.data);
          this.projects$.next(allProjects);
          this.isLoading = false;
        }),
        finalize(() => {
          this.canScroll = true;
        }),
      )
      .subscribe();
  }

  removeFromQueueDidClick(projectID: number) {
    if (this.isInReviewQueueSection) {
      const projects = this.projects$.value;
      const index = projects.findIndex((project) => project.id === projectID);
      projects.splice(index, 1);
      this.projects$.next(projects);
    }
  }

  public sortByCoordinates(coordinates: Point) {
    this.isCoordinatesSort = true;
    this.canScroll = false;
    this.coordinates = coordinates;
    this.resetProjects();
    this.loadProjects();
  }

  private resetProjects() {
    this.page = 0;
    this.projects$.next([]);
  }

  public firstInQueue(projectId: number) {
    const projects = this.projects$.value;
    const index = projects.findIndex((project) => project.id === projectId);
    projects.unshift(...projects.splice(index, 1));
  }
}
