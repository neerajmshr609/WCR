import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/shared/models/project.model';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  project: Project;
  projectID: number;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.projectID = +params.id;

    this.projectService.fetchProject(this.projectID).subscribe((project) => {
      this.project = project;
      this.titleService.setTitle(project.title ? project.title : 'Untitled');
    });
  }
}
