import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-price-slider',
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceSliderComponent implements OnInit {
  iconGear = 'assets/gear.svg';
  @Input() advisorRate: number;
  @Input() public isAdvisor: boolean;
  @Input() fixedPrice: number;
  @Input() maxPrice = 100;
  @Input() minPrice = 1;
  @Input() step = 1;
  @Input() showHourPrefix = true;
  @Input() placement: 'top' | 'bottom' = 'bottom';
  @Input() title = 'price-slider.change_hourly_rate';
  @Input() showSubTitle = true;

  @Input() set gearIcon(src: string) {
    if (src) {
      this.iconGear = src;
    }
  }

  @Input() isDisabledSelect = false;

  @Output() sliderValueChange = new EventEmitter<number>();
  @Output() confirmChangedPrice = new EventEmitter<number>();

  sliderValue: number;
  sliderConfig: any;
  showSlider = false;

  onValueChanged(value: number) {
    this.sliderValueChange.emit(value);
  }

  toggleSlider() {
    this.showSlider = !this.showSlider;
    if (!this.showSlider) {
      this.confirmChangedPrice.emit(this.sliderValue);
    }
  }

  ngOnInit(): void {
    this.sliderValue = this.advisorRate;

    this.sliderConfig = {
      start: this.advisorRate,
      step: this.step,
      range: { min: this.minPrice, max: this.maxPrice },
    };
  }

  increaseSlidePrice() {
    if (this.sliderValue < this.maxPrice) {
      this.sliderValue += 1;
    }
  }

  decreaseSliderValue() {
    if (this.sliderValue > this.minPrice) {
      this.sliderValue -= 1;
    }
  }
}
