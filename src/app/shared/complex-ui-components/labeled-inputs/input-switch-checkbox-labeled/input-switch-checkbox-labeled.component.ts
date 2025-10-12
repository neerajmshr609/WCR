import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, HostListener, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSwitchCheckboxComponent } from '../../../UIkit/inputs/input-switch-checkbox/input-switch-checkbox.component';

@Component({
  selector: 'app-input-switch-checkbox-labeled',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSwitchCheckboxLabeledComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, InputSwitchCheckboxComponent],
  templateUrl: './input-switch-checkbox-labeled.component.html',
  styleUrls: ['./input-switch-checkbox-labeled.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSwitchCheckboxLabeledComponent implements ControlValueAccessor {
  readonly disabled = model<boolean>(false);
  readonly value = model<boolean>(false);
  readonly label = input<string>('');
  readonly description = input<string>('');

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
    if (!this.disabled()) {
      this.value.set(!this.value());
      if (typeof this.onChange === 'function') {
        this.onChange(this.value());
      }
    }
  }

  labelClickHandler() {
    return false;
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