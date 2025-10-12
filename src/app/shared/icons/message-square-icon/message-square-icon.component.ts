import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-message-square-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: 16px;
      height: 16px;
    }
  `,
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      d="M14.5 10C14.5 10.3536 14.3595 10.6928 14.1095 10.9428C13.8594 11.1929 13.5203 11.3333 13.1667 11.3333H5.16667L2.5 14V3.33333C2.5 2.97971 2.64048 2.64057 2.89052 2.39052C3.14057 2.14048 3.47971 2 3.83333 2H13.1667C13.5203 2 13.8594 2.14048 14.1095 2.39052C14.3595 2.64057 14.5 2.97971 14.5 3.33333V10Z"
      [attr.stroke]="color()"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`,
})
export class MessageSquareIconComponent extends BaseIconDirective {
  color = input('#F5F5F5');
}
