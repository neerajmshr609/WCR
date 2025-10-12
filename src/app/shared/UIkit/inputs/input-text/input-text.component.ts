import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  HostBinding,
  input,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements ControlValueAccessor {
  readonly placeholder = input<string | null>(null);
  readonly disabled = model<boolean>(false);

  readonly value = signal<string | null>(null);

  readonly invalid = input(false);

  @HostBinding('class.invalid')
  get isInvalid(): boolean {
    return this.invalid();
  }

  onChange?: (value: string) => void;
  onTouched?: () => void;

  constructor() {
    effect(() => {
      const currentValue = this.value();
      if (typeof this.onChange === 'function') {
        this.onChange(currentValue);
      }
    });
  }

  blurHandler() {
    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
