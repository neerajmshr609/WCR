import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-content-editable-field',
  templateUrl: './content-editable-field.component.html',
  styleUrls: ['./content-editable-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableFieldComponent),
      multi: true,
    },
  ],
})
export class ContentEditableFieldComponent implements ControlValueAccessor {
  @Input() placeHolder = '';
  @Input() maxLength = 500;
  @Input() minRows = 1;

  @Input() set editMode(value: boolean) {
    this.isReadOnly = value;
  }

  @Output() onFocusOut: EventEmitter<unknown> = new EventEmitter<unknown>();

  value = '';
  isReadOnly = true;
  disabled = false;

  protected onTouched: () => void;
  protected onChange: (value: string) => void;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  focusOut(): void {
    this.isReadOnly = true;
    this.onFocusOut.emit();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChangeValue(text: string): void {
    this.setValue(text, true);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    this.setValue(value, false);
    this.cdr.markForCheck();
  }

  protected setValue(value: string, emitEvent: boolean): void {
    this.value = value;
    if (emitEvent && this.onChange) {
      this.onChange(value);
      this.onTouched();
    }
  }
}
