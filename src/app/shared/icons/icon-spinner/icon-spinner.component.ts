import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-spinner.component.html',
  styleUrls: ['./icon-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSpinnerComponent extends BaseIconDirective {
  readonly sizeInput = input(24);
  readonly color = input('#1E1E1E');
  readonly strokeWidth = input(2.5);
  readonly size = computed(() => this.sizeInput() + 'px');
}
