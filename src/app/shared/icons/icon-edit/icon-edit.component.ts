import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-edit.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconEditComponent extends BaseIconDirective {
  readonly color = input('#757575');
  readonly strokeWidth = input(1.6);
}
