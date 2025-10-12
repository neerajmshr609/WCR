import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIconComponent } from '../../../icons/settings-icon/settings-icon.component';

@Component({
  selector: 'app-button-filter',
  standalone: true,
  imports: [CommonModule, SettingsIconComponent],
  templateUrl: './button-filter.component.html',
  styleUrls: ['./button-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonFilterComponent {
  readonly isActive = input(false);
  readonly isOpened = input(false);
}
