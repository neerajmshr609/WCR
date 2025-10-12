import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-price-control-slider',
  templateUrl: './price-control-slider.component.html',
  styleUrls: ['./price-control-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriceControlSliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceControlSliderComponent
  implements OnInit, ControlValueAccessor
{
  @Input() minPrice = 0;
  @Input() maxPrice = 1000;
  @Input() step = 1;

  disabled = false;
  value = 0;
  sliderConfig: any;

  protected onTouched: () => void;
  protected onChange: (value: number) => void;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.sliderConfig = {
      start: this.value,
      step: this.step,
      range: { min: this.minPrice, max: this.maxPrice },
    };
  }

  up() {
    if (this.value < this.maxPrice) {
      this.setValue(this.value + this.step, true);
    }
  }

  down() {
    if (this.value > this.minPrice) {
      this.setValue(this.value - this.step, true);
    }
  }

  sliderValueChanged(): void {
    this.setValue(this.value, true);
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: number) {
    this.setValue(value, false);
    this.cdr.markForCheck();
  }

  protected setValue(value: number, emitEvent: boolean) {
    const parsed = parseInt(value as any, 10);
    this.value = isNaN(parsed) ? 0 : parsed;
    if (emitEvent && this.onChange) {
      this.onChange(value);
      this.onTouched();
    }
  }
}
