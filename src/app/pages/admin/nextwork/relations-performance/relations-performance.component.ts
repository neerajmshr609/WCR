import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Relation } from 'src/app/shared/models/relation.model';
import { AdminService } from '../../admin.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-relations-performance',
  templateUrl: './relations-performance.component.html',
  styleUrls: ['./relations-performance.component.scss'],
})
export class RelationsPerformanceComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = [
    'fromcategory_name',
    'weight',
    'tocategory_name',
    'discouraging',
    'unhelpful',
    'helpful',
    'inspiring',
  ];
  dataSource = new MatTableDataSource<Relation>();
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.fetchRelationsForPerformance().subscribe((results) => {
      this.dataSource.data = results;
      this.dataSource.sort = this.sort;
    });
  }
}
