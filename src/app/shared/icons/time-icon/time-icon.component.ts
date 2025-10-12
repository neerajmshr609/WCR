import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-time-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-icon.component.html',
  styleUrls: ['./time-icon.component.scss'],
})
export class TimeIconComponent extends BaseIconDirective {}
