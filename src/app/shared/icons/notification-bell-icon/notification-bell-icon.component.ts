import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-notification-bell-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification-bell-icon.component.html',
  styleUrls: ['./notification-bell-icon.component.scss'],
})
export class NotificationBellIconComponent extends BaseIconDirective {}
