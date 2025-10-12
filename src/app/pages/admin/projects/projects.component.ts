import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { takeUntil } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class ProjectsComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'id',
    'show_in_give_feedback',
    'show_in_public_feed',
    'private',
    'created_at',
    'last_rate_time',
    'title',
    'category_name',
    'review_count',
    'user.email',
  ];
  expandedElement: Project | null;
  dataSource = new MatTableDataSource<Project>();

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.adminService
      .fetchProjects()
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
      });
  }
}
