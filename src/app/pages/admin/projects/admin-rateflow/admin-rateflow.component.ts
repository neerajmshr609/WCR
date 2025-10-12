import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ProjectService } from 'src/app/services/project.service';
import { RateflowService } from 'src/app/services/rateflow.service';
import { Category } from 'src/app/shared/models/category.model';
import { Feedbackobject } from 'src/app/shared/models/feedbackobject.model';
import { Project } from 'src/app/shared/models/project.model';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { Skipsetting } from 'src/app/shared/models/skipsetting.model';
import { User } from 'src/app/shared/models/user.model';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-admin-rateflow',
  templateUrl: './admin-rateflow.component.html',
  styleUrls: ['./admin-rateflow.component.scss'],
})
export class AdminRateflowComponent extends BaseComponent implements OnInit {
  @ViewChild('greytBtnRef') private greytBtnRef: ElementRef;

  dragDrop = false;
  drawingDesktop = false;
  drawingMobile = false;
  linesPoints: Array<string> = null;
  elementsToDrop: Projectfile[] = [];
  droppedElements: Projectfile[] = [];
  sortOptions = {
    group: 'resort',
    onEnd: (event: any) => {
      this.rateflowService.newOrder.next(this.elementsToDrop);
    },
  };

  greytmeUsers: User[];
  selectedRaterID: number;
  @Input() projectID;
  isSkipMode = false;
  skipSetting: Skipsetting;
  isSaving = false;
  sliderValue: number;
  project: Project;
  selectedFile: Projectfile;
  activeFeedbackObject: Feedbackobject;
  noprojects = false;
  isSingleFileProject = false;

  selectedfileDidChange$ = new BehaviorSubject<Projectfile>(null);

  filesFeedbacks$ = new Subject<Feedbackobject[]>();

  constructor(
    private rateflowService: RateflowService,
    private projectService: ProjectService,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit() {
    this.getNextProject();
    this.adminService
      .fetchGreytmeUsersForProject(this.projectID)
      .subscribe((results) => {
        this.greytmeUsers = results;
      });
  }

  getNextProject() {
    this.selectedRaterID = null;
    this.project = null;

    const btn = this.greytBtnRef?.nativeElement as HTMLElement;
    btn?.classList.toggle('btn--disabled');
    this.rateflowService.reinitState();

    this.projectService.fetchProject(this.projectID).subscribe((project) => {
      if (project) {
        this.isSingleFileProject = project.projectfiles.length === 1;
        this.project = project;
        this.activeFeedbackObject =
          this.rateflowService.createProjectfeedbackForProject(project);
        this.elementsToDrop = [...this.project.projectfiles];

        if (this.isSingleFileProject) {
          this.onSelectedFileChange(this.project.projectfiles[0]);
        }
      } else {
        this.noprojects = true;
      }
    });
  }

  onFeedbackObjectUpdate(update: Feedbackobject) {
    switch (update.ratingtype) {
      case 'project':
        this.rateflowService.updateProjectFeedback(update);
        break;
      case 'info':
        this.rateflowService.updateCurrentInfoFeedback(update);
        break;
      case 'files':
        this.rateflowService.updateFilesFeedbackForFile(null, update);
        this.filesFeedbacks$.next(
          this.rateflowService.state.currentFilesFeedbacks,
        );
        break;
      default:
        return;
    }
  }

  onSelectedGrid() {
    this.selectedFile = null;
    this.activeFeedbackObject = this.rateflowService.getProjectFeedback();
  }

  onSelectedProjectInfo() {
    this.selectedFile = null;
    this.activeFeedbackObject =
      this.rateflowService.updateCurrentInfoFeedback();
  }

  onSelectedFileChange(file: Projectfile) {
    this.selectedFile = file;
    this.activeFeedbackObject =
      this.rateflowService.updateFilesFeedbackForFile(file);
    this.selectedfileDidChange$.next(file);
  }

  onSkipModeToggled(isToggled: boolean) {
    this.isSkipMode = isToggled;
  }

  onSkipModeChanged(skipSetting: {
    mode: string;
    category: Category;
    parentCategory: Category;
  }) {
    this.skipSetting = skipSetting;
  }

  onFileDetailClose() {
    this.selectedFile = null;
    this.activeFeedbackObject = this.rateflowService.getProjectFeedback();
  }

  didChangeRater(change: MatOptionSelectionChange) {
    this.selectedRaterID = change.source.value;
  }

  toggleDragDrop(toggle) {
    this.dragDrop = toggle;
  }
  toggleDraw(event) {
    if (event) {
      this.linesPoints = event.linesPoints;
      if (window.innerWidth < 769) {
        this.drawingMobile = event.active;
      } else {
        this.drawingDesktop = event.active;
      }
    }
  }

  addDraw(e) {
    this.toggleDraw(false);
    this.rateflowService.drawing.next(e);
  }

  onRate() {
    if (this.rateflowService.isEmpty()) {
      return;
    }

    this.isSaving = true;

    this.rateflowService
      .saveAllData(this.project, this.selectedRaterID, false)
      .pipe(
        finalize(() => (this.isSaving = false)),
        takeUntil(this.destroyed),
      )
      .subscribe(() => {
        this.greytmeUsers = this.greytmeUsers.filter(
          (obj) => obj.id !== this.selectedRaterID,
        );
        this.selectedRaterID = null;
        this.rateflowService.reinitState();
      });
  }
}
