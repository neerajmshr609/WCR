import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-scroll-btn',
  templateUrl: './scroll-btn.component.html',
  styleUrls: ['./scroll-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollBtnComponent {
  @Output() clickedScrollUp: EventEmitter<unknown> =
    new EventEmitter<unknown>();
  @Output() clickedScrollDown: EventEmitter<unknown> =
    new EventEmitter<unknown>();
}
