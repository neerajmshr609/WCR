import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-arrow-down-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arrow-down-icon.component.html',
  styleUrl: './arrow-down-icon.component.scss',
})
export class ArrowDownIconComponent extends BaseIconDirective {
  public type = input<'standard' | 'long'>('standard');
}
