import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';

interface Data {
  step: number;
  project: Project;
  student: User;
}
@Component({
  selector: 'app-fourth-card',
  templateUrl: './fourth-card.component.html',
  styleUrls: ['./fourth-card.component.scss'],
})
export class FourthCardComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Data) {}

  ngOnInit(): void {}
}
