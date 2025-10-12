import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IframelyResponse } from 'src/app/shared/models/iframely-response';

@Component({
  selector: 'app-iframe-preview-dialog',
  templateUrl: './iframe-preview-dialog.component.html',
  styleUrls: ['./iframe-preview-dialog.component.scss'],
})
export class IframePreviewDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IframelyResponse) {}

  ngOnInit(): void {}
}
