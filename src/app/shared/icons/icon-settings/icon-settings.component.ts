import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-settings.component.html',
  styleUrls: ['./icon-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSettingsComponent extends BaseIconDirective {}
