import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlusIconComponent } from '../../../icons/plus-icon/plus-icon.component';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [CommonModule, PlusIconComponent],
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent {
  disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
}
