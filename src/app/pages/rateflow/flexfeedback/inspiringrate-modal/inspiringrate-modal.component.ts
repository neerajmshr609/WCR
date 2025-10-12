import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inspiringrate-modal',
  templateUrl: './inspiringrate-modal.component.html',
  styleUrls: ['./inspiringrate-modal.component.scss'],
})
export class InspiringrateModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
