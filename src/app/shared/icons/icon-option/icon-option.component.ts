import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-option.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconOptionComponent extends BaseIconDirective {
  color = input('#1E1E1E');
}
