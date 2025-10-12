import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-lock-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lock-icon.component.html',
  styleUrls: ['./lock-icon.component.scss'],
})
export class LockIconComponent extends BaseIconDirective {}
