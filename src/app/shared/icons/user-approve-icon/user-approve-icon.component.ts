import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-user-approve-icon',
  templateUrl: './user-approve-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserApproveIconComponent extends BaseIconDirective {
  color = input('#1E1E1E');
  strokeWidth = input(2);
}
