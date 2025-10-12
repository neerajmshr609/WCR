import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-chevron-down-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chevron-down-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class ChevronDownIconComponent extends BaseIconDirective {
  readonly color = input('#B0B0B0');
  readonly strokeWidth = input(2);
}
