import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-settings-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-icon.component.html',
  styleUrls: ['../icon.base.component.scss'],
})
export class SettingsIconComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
  readonly strokeWidth = input(2);
}
