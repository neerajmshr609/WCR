import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-screenshot-overlay',
  templateUrl: './screenshot-overlay.component.html',
  styleUrls: ['./screenshot-overlay.component.scss'],
})
export class ScreenshotOverlayComponent implements OnInit {
  @Input() src: string;
  @Input() isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
