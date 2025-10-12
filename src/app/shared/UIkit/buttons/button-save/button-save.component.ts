import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, UISizes } from '../../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button-save',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './button-save.component.html',
  styles: `:host {
      display: block;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSaveComponent {
  readonly disabled = input<boolean>(false);
  readonly size = input<UISizes>('small');
}
