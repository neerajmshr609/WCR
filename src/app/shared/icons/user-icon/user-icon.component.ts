import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-user-icon',
  standalone: true,
  imports: [],
  templateUrl: './user-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../icon.base.component.scss'],
})
export class UserIconComponent extends BaseIconDirective {}
