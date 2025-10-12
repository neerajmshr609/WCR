import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-globe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-globe.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconGlobeComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
  readonly strokeWidth = input(2.5);
}
