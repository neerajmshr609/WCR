import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectShareDialogComponent } from './project-share-dialog/project-share-dialog.component';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { InsightsChannelEnum } from 'src/app/shared/enums';
import { PQACollection } from 'src/app/shared/models/PQACollection.model';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { IMenuItem } from '../../main-content-menu/model/menu-item';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent extends BaseComponent implements OnInit {
  currentUser: User;

  projects: Project[];
  ctbProjects: Project[];
  pqaCollections: PQACollection[];

  public menuItems: IMenuItem[] = [
    {
      title: 'choices.overview',
      param: '',
    },
    {
      title: 'choices.best',
      param: InsightsChannelEnum.choosethebest,
    },
    {
      title: 'choices.custom',
      param: InsightsChannelEnum.presenterquestion,
    },
  ];
  public menuItem: IMenuItem;
  public channels = InsightsChannelEnum;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {
    super();
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    if (params.projecttoken) {
      const publicLink =
        window.location.origin + '/rateflow/' + params.projecttoken;
      this.showProjectShareDialog(publicLink, params.isEdit);
    }

    this.authService.userSubject$
      .pipe(
        takeUntil(this.destroyed),
        tap((user) => (this.currentUser = user)),
      )
      .subscribe();

    this.fetchProjects();
    this.fetchPresenterQuestionAnswers();
    this.fetchCTBProjects();

    this.preselectMenuItem();
  }

  fetchProjects() {
    this.projectService
      .fetchProjects()
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => (this.projects = res)),
      )
      .subscribe();
  }

  fetchCTBProjects() {
    this.projectService
      .fetchCTBProjects()
      .pipe(takeUntil(this.destroyed))
      .subscribe((results) => {
        this.ctbProjects = [];
        for (const project of results) {
          project.projectfiles = project.projectfiles.filter((item) =>
            item.mimetype.includes('image', 0),
          );

          if (project.projectfiles.length) {
            this.ctbProjects.push(project);
          }
        }
      });
  }

  fetchPresenterQuestionAnswers() {
    this.pqaCollections = [];
    this.projectService
      .fetchPQAnswers(this.currentUser.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe((results) => {
        const questions = [
          ...new Set(results.map((obj) => obj.presenterquestion_id)),
        ];
        const collections = [];

        questions.forEach((question) => {
          const answers = results.filter(
            (ans) => ans.presenterquestion_id === question,
          );
          const pqaCollection = new PQACollection();
          pqaCollection.answers = answers;
          pqaCollection.project_id = answers[0].project_id;
          pqaCollection.presenterQuestion = results.find(
            (qs) => qs.presenterquestion_id === question,
          ).presenterquestion;
          collections.push(pqaCollection);
        });

        this.pqaCollections = collections;
      });
  }

  showProjectShareDialog(projectShareURL: string, isEdit = false) {
    this.dialog.open(ProjectShareDialogComponent, {
      data: { projectShareURL, isEdit },
    });
  }

  private onDelete(projectID: number) {
    this.projectService
      .deleteProject(projectID)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.projects = this.projects.filter((obj) => obj.id !== projectID);
      });
  }

  public confirmDeleteDialog(projectID: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '92vw',
      maxWidth: '800px',
      panelClass: 'modal',
      data: { message: 'Are you sure you want to do this?' },
    });

    const subscription = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.onDelete(projectID);
      }
      subscription.unsubscribe();
    });
  }

  private preselectMenuItem() {
    const param = this.route.snapshot.queryParams.channel;
    const index = this.menuItems.findIndex((item) => item.param === param);
    this.menuItem = this.menuItems[index === -1 ? 0 : index];

    this.didSelectMenuItem(index === -1 ? 0 : index);
  }

  public didSelectMenuItem(index: number): void {
    this.menuItem = this.menuItems[index];
    const channel = this.menuItem.param;

    this.router.navigate([], {
      replaceUrl: true,
      queryParams: {
        channel,
      },
    });

    this.cdRef.detectChanges();
  }
}
