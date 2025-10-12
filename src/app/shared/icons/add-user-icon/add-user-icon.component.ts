import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-add-user-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-user-icon.component.html',
  styleUrls: ['./add-user-icon.component.scss'],
})
export class AddUserIconComponent extends BaseIconDirective {}
