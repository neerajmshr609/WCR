import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, input, model, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextareaComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextareaComponent implements ControlValueAccessor {
  readonly placeholder = input<string | null>(null);
  readonly disabled = model<boolean>(false);

  readonly value = signal<string | null>(null);

  @ViewChild('textAreaInput')
  private readonly _textAreaInput: ElementRef<HTMLTextAreaElement>;

  readonly invalid = input(false);

  @HostBinding('class.invalid')
  get isInvalid(): boolean {
    return this.invalid();
  }


  onChange?: (value: string) => void;
  onTouched?: () => void;

  private get _textAreaValue() {
    return this._textAreaInput.nativeElement.value;
  }

  changeHandler() {
    if (typeof this.onChange === 'function') {
      this.onChange(this._textAreaValue);
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
