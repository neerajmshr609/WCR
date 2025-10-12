import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Permisson } from '../../interfaces';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent {
  permissions = input<Permisson[]>();
}
