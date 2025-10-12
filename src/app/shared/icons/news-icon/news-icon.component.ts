import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-news-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class NewsIconComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
}
