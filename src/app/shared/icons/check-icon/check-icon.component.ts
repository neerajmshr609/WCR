import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-check-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './check-icon.component.html',
  styleUrl: './check-icon.component.scss',
})
export class CheckIconComponent extends BaseIconDirective {
  public fill = input<string>('#F5F5F5');
}
