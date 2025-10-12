import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-public-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-public-profile.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPublicProfileComponent extends BaseIconDirective {
  readonly color = input('#1E1E1E');
}
