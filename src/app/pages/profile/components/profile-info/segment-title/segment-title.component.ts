import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-segment-title',
  template: `<h5 class="segment-title">{{ title() | translate }}</h5>`,
  styleUrls: ['./segment-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentTitleComponent {
  readonly title = input.required<string>();
}
