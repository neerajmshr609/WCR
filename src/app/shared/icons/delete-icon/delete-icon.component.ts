import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-delete-icon',
  templateUrl: './delete-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class DeleteIconComponent extends BaseIconDirective {
  color = input('#1E1E1E');
  strokeWidth = input(1.6);
}
