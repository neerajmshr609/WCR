import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-cancel-icon',
  templateUrl: './cancel-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelIconComponent extends BaseIconDirective {}
