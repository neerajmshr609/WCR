import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-recommended',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-recommended.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconRecommendedComponent extends BaseIconDirective {
  readonly fill = input('#1E1E1E');
  readonly color = input('white');
}
