import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-collapse-button',
  templateUrl: './collapse-button.component.html',
  styleUrls: ['./collapse-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapseButtonComponent {
  readonly collapsed = input.required<boolean>();
  readonly chevronsColor = '#858585';
}
