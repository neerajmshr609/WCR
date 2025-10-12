import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss'],
})
export class UserProjectsComponent extends BaseComponent implements OnInit {
  public userProjects$: Observable<Project[]>;
  public currentUser: User;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res || !this.authService.userIsSignedIn()),
        tap((res) => (this.currentUser = res)),
        tap((res) => {
          if (res?.sharetoken === this.route.parent.parent.snapshot.params.id) {
            this.userProjects$ = this.projectService.fetchProjects();
            return;
          }

          this.userProjects$ = this.authService.userProfileInfo$.pipe(
            mergeMap((author) =>
              this.projectService.fetchPublicProjectsForUserID(author.id),
            ),
          );
        }),
      )
      .subscribe();
  }
}
