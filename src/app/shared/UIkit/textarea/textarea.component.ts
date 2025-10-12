import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea.component.html',
  imports: [NgClass, ReactiveFormsModule],
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent {
  public control = input<AbstractControl | undefined | null>();
  public inputName = input<string>();
  public label = input<string>();
  public placeholder = input<string>();
  public rows = input<number>(3);
  public cols = input<number>(3);
  public minLength = input<number | null>();
  public readonly = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
  public disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
  public required = input(false);
}
