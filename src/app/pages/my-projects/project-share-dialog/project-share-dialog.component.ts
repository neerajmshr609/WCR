import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-project-share-dialog',
  templateUrl: './project-share-dialog.component.html',
  styleUrls: ['./project-share-dialog.component.scss'],
})
export class ProjectShareDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
