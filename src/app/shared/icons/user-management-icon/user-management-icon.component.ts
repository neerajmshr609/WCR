import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-user-management-icon',
  templateUrl: './user-management-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../icon.base.component.scss'],
})
export class UserManagementIconComponent extends BaseIconDirective {
  color = input('#000000');
}
