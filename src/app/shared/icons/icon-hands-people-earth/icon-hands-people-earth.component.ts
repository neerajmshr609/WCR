import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-hands-people-earth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-hands-people-earth.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconHandsPeopleEarthComponent extends BaseIconDirective {
  readonly color = input('#1e1e1e');
  readonly backgroundColor = input('#F5F5F5');
  readonly strokeWidth = input(1.54074);
}
