import { ChangeDetectionStrategy, Component, computed, HostListener, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveIconComponent } from '../../../icons/save-icon/save-icon.component';
import { ButtonComponent, UISizes } from '../../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button-icon-save',
  standalone: true,
  imports: [CommonModule, SaveIconComponent, ButtonComponent, TranslateModule],
  templateUrl: './button-icon-save.component.html',
  styleUrls: ['./button-icon-save.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconSaveComponent {
  readonly disabled = input<boolean>(false);
  readonly size = input<UISizes>('small');
  private readonly _isMouseOver = signal<boolean>(false);

  readonly iconColor = computed(() => this.disabled() ? '#B3B3B3' : '#F5F5F5');

  @HostListener('mouseover')
  mouseOver(): void {
    this._isMouseOver.set(true);
  }

  @HostListener('mouseout')
  mouseOut(): void {
    this._isMouseOver.set(false);
  }
}
