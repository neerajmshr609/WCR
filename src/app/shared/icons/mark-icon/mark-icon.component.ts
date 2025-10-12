import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-mark-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mark-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class MarkIconComponent extends BaseIconDirective {
  readonly color = input('#F5F5F5');
  readonly strokeWidth = input(4);
}
