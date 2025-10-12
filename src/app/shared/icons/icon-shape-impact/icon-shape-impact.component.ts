import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-shape-impact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-shape-impact.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconShapeImpactComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
}
