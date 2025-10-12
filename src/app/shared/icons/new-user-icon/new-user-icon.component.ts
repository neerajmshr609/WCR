import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-new-user-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-user-icon.component.html',
  styleUrls: ['./new-user-icon.component.scss'],
})
export class NewUserIconComponent extends BaseIconDirective {}
