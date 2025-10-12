import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-down-btn',
  templateUrl: './scroll-down-btn.component.html',
  styleUrl: './scroll-down-btn.component.scss',
})
export class ScrollDownBtnComponent {
  @Input() bottom: string;
  @Input() right: string;
  @Input() top: string;
  @Input() left: string;
  @Input() shownNumber: number;

  @Output() clickedScrollDown: EventEmitter<unknown> =
    new EventEmitter<unknown>();
}
