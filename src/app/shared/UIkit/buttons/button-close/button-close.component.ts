import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { CloseIconComponent } from '../../../icons/close-icon/close-icon.component';

@Component({
  selector: 'app-button-close',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent, CloseIconComponent],
  templateUrl: './button-close.component.html',
  styleUrls: ['./button-close.component.scss'],
})
export class ButtonCloseComponent {}
