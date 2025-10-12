import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-heart-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
  `,
  templateUrl: './heart-icon.component.html',
})
export class HeartIconComponent extends BaseIconDirective {
  readonly color = input('#757575');
  readonly outline = input<boolean>(true);
}
