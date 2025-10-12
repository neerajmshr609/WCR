import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button-icon-oval',
  templateUrl: './button-icon-oval.component.html',
  styleUrls: ['./button-icon-oval.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class ButtonIconOvalComponent {
  disabled = input<boolean>(false);
  isActive = input<boolean>(false);
}
