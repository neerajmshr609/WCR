import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, UISizes } from '../../button/button.component';
import { SaveIconComponent } from '../../../icons/save-icon/save-icon.component';
import { IconEditComponent } from '../../../icons/icon-edit/icon-edit.component';

@Component({
  selector: 'app-button-icon-edit',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconEditComponent],
  templateUrl: './button-icon-edit.component.html',
  styleUrls: ['./button-icon-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconEditComponent {
  readonly disabled = input<boolean>(false);
  readonly size = input<UISizes>('small');
  private readonly _isMouseOver = signal<boolean>(false);

  readonly iconColor = computed(() =>
    this.disabled() ? '#B3B3B3' : '#F5F5F5',
  );

  @HostListener('mouseover')
  mouseOver(): void {
    this._isMouseOver.set(true);
  }

  @HostListener('mouseout')
  mouseOut(): void {
    this._isMouseOver.set(false);
  }
}
