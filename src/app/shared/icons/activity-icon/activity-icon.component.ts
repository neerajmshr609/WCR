import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-activity-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-icon.component.html',
  styleUrls: ['./activity-icon.component.scss'],
})
export class ActivityIconComponent extends BaseIconDirective {}
