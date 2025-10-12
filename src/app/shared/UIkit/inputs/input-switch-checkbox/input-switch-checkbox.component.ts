import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, HostListener, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-switch-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSwitchCheckboxComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
  templateUrl: './input-switch-checkbox.component.html',
  styleUrls: ['./input-switch-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSwitchCheckboxComponent implements ControlValueAccessor {
  readonly disabled = model<boolean>(false);
  readonly value = model<boolean>(false);
  readonly disableClickListener = input(false);

  @HostBinding('class.disabled')
  get isDisabled() {
    return this.disabled();
  }

  @HostBinding('class.checked')
  get isChecked() {
    return this.value();
  }


  onChange?: (value: boolean) => void;
  onTouched?: () => void;

  @HostListener('click')
  toggle(): void {
    if (!this.disabled() && !this.disableClickListener()) {
      this.value.set(!this.value());
      if (typeof this.onChange === 'function') {
        this.onChange(this.value());
      }
    }
  }

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
