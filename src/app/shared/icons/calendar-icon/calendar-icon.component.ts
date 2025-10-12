import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-calendar-icon',
  templateUrl: './calendar-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar-icon.component.scss'],
})
export class CalendarIconComponent extends BaseIconDirective {}
