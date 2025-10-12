import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-arrow',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-arrow.component.html',
  styleUrls: ['./icon-arrow.component.scss'],
})
export class IconArrowComponent extends BaseIconDirective {
  public direction = input<'down' | 'up' | 'left' | 'right'>('down');
}
