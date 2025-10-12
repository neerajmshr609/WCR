import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-share-second',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-share-second.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconShareSecondComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
  readonly strokeWidth = input(1.6);
}
