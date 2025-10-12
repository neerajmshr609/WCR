import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  finalize,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { AdvisorsService } from './services/advisors.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { OnlineService } from 'src/app/services/online.service';
import { ProjectService } from 'src/app/services/project.service';
import { SearchService } from 'src/app/services/search.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Project } from 'src/app/shared/models/project.model';
import { Skill } from 'src/app/shared/models/skill.model';
import { User } from 'src/app/shared/models/user.model';
import { ProjectSkill } from '../../shared/models/ProjectSkill.model';

@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.scss'],
})
export class AdvisorsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public isLoading: boolean;
  public isSmallScreen: boolean;

  public currentUser: User;
  public currentUserProjects: Project[];

  public advisors: User[];
  public filteredAdvisors: User[];
  public isFiltered = false;
  public filteredByOnline: boolean;

  public sortSkillsChange = new EventEmitter<void>();
  selectedSkills$: Observable<Skill[]> =
    this.searchService.selectedSkills$.asObservable();

  constructor(
    private authService: AuthService,
    private newsfeedService: NewsfeedService,
    private projectService: ProjectService,
    private onlineService: OnlineService,
    private searchService: SearchService,
    private advisorsService: AdvisorsService,
    private observer: BreakpointObserver,
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchService.currentPage$.next('advisors');
    this.fetchData();
    this.subscribeToUser();
    this.subscribeToSkills();
    this.subscribeToOnlineFilter();
    this.subscribeToOnlineStatus();
    this.observeBreakpoint();
  }

  private subscribeToUser() {
    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        take(1),
        map((res) => (this.currentUser = res)),
        switchMap(() => this.fetchUserProjects()),
        map((projects) => {
          this.currentUserProjects = projects;
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  private subscribeToOnlineStatus() {
    this.onlineService.userChangedOnlineStatus$
      .pipe(
        filter((res) => !!res),
        takeUntil(this.destroyed),
      )
      .subscribe((res) => {
        const advisor = this.advisors?.find((a) => a.id === res.id);

        if (advisor) {
          advisor.online = res.online;
        }
      });
  }

  private subscribeToSkills() {
    this.searchService.selectedSkills$
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => this.selectedSkillsChanged(res)),
      )
      .subscribe();
  }

  pickedSkills(selectedSkills: ProjectSkill[]): void {
    this.searchService.selectedSkills$.next(selectedSkills);
    this.searchService.selectedOnline$.next(true);
  }

  private subscribeToOnlineFilter() {
    this.searchService.selectedOnline$
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => this.filterByOnline(res)),
      )
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

  fetchUserProjects() {
    return this.projectService.fetchPublicProjectsForUserID(
      this.currentUser.id,
    );
  }

  selectedSkillsChanged(selectedSkills: Skill[]) {
    this.sortSkillsChange.emit();

    if (!this.advisors) {
      return;
    }

    if (!selectedSkills.length) {
      this.filteredAdvisors = JSON.parse(JSON.stringify(this.advisors));
      return;
    }

    if (!this.isFiltered) {
      this.isFiltered = true;
    }

    const reversedSkills = [...selectedSkills];
    reversedSkills.reverse();

    this.filteredAdvisors = this.advisors
      .filter((advisor) => {
        return advisor.user_skills
          .map((skill) => skill.skill.id)
          .some((id) => {
            return reversedSkills.map((skill) => skill.id).includes(id);
          });
      })
      .sort((a) => (a.pinned ? -1 : 1));
    this.filteredAdvisors.forEach((filteredAdvisor) =>
      filteredAdvisor.user_skills.sort((a) => {
        return reversedSkills.map((skill) => skill.id).includes(a.skill.id)
          ? -1
          : 0;
      }),
    );
  }

  fetchData() {
    this.isLoading = true;

    this.newsfeedService
      .fetchAdvisors(this.filteredByOnline)
      .pipe(
        finalize(() => (this.isLoading = false)),
        tap((users) => {
          this.advisors = users;
          this.advisors.forEach(
            (a) =>
              (a.pinned = this.currentUser?.pinned_advisors?.includes(a.id)),
          );
          this.filteredAdvisors = this.sortAdvisors(this.advisors);
        }),
        switchMap((res) => {
          if (!this.currentUser) {
            return EMPTY;
          }
          return forkJoin(
            res.map((u) =>
              this.advisorsService.fetchFunnelPositionForAdvisor(u.id),
            ),
          );
        }),
        takeUntil(this.destroyed),
      )
      .subscribe();
  }

  private filterByOnline(onlineOnly: boolean) {
    this.filteredByOnline = onlineOnly;
    this.filteredAdvisors = this.sortAdvisors(this.filteredAdvisors);
    this.sortSkillsChange.emit();
  }

  private sortAdvisors(advisors: User[]): User[] {
    const sort = (array: User[]) =>
      array.sort((a, b) => {
        const aId = a.id;
        const bId = b.id;

        switch (true) {
          case aId < bId:
            return 1;
          case aId > bId:
            return -1;
          default:
            return 0;
        }
      });

    if (this.filteredByOnline && advisors) {
      return [
        ...sort(advisors.filter((a) => a.pinned && a.online)),
        ...sort(advisors.filter((a) => !a.pinned && a.online)),
        ...sort(advisors.filter((a) => a.pinned && !a.online)),
        ...sort(advisors.filter((a) => !a.pinned && !a.online)),
      ];
    } else if (advisors) {
      return [
        ...sort(advisors.filter((a) => a.pinned)),
        ...sort(advisors.filter((a) => !a.pinned)),
      ];
    }
  }

  public onPinToTop(): void {
    this.filteredAdvisors = this.sortAdvisors(this.filteredAdvisors);

    this.sortSkillsChange.emit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.searchService.currentPage$.next(null);
    this.searchService.selectedSkills$.next([]);
  }
}
