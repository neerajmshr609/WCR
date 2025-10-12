import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-save-icon',
  templateUrl: './save-icon.component.html',
  standalone: true,
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveIconComponent extends BaseIconDirective {
  readonly strokeWidth = input(2);
}
