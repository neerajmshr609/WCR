import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drag-slider-modal',
  templateUrl: './drag-slider-modal.component.html',
  styleUrls: ['./drag-slider-modal.component.scss'],
})
export class DragSliderModalComponent implements OnInit {
  @Output() showIframe = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
