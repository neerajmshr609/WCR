import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type UISizes = 'small' | 'medium' | 'large';

export type UIType = 'primary' | 'neutral' | 'subtle';

export type BtnType = 'reset' | 'button' | 'submit';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./button.component.scss'],
  imports: [NgClass],
})
export class ButtonComponent {
  public size = input<UISizes>();

  public btnUIType = input<UIType>();

  public type = input<BtnType>('button');

  public iconBtn = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  public dangerBtn = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  public selected = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  public disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  // Only Icon btn
  public rounded = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
}
