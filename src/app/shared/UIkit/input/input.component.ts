import { Component, HostBinding, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  imports: [NgClass, ReactiveFormsModule],
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  public control = input<AbstractControl | undefined | null>();
  public inputName = input<string>();
  public label = input<string>();
  public placeholder = input<string>();
  public type = input<string>('text');
  public disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  @HostBinding('class.valid-error') get errorState() {
    return this.control()?.invalid && this.control()?.touched;
  }
}
