import { Options } from '@angular-slider/ngx-slider';
import { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-slider',
  templateUrl: './payment-slider.component.html',
  styleUrls: ['./payment-slider.component.scss'],
})
export class PaymentSliderComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() inputValue;

  @Output() changes = new EventEmitter();

  show$: Observable<boolean>;
  manualRefresh = new EventEmitter<void>();

  options: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    showTicks: true,
    showSelectionBar: true,
    animateOnMove: true,
    translate: (value: number): string => {
      return '€' + value;
    },
    getSelectionBarColor: (value: number): string => {
      if (value <= 14) {
        return 'red';
      }

      if (value <= 30) {
        return 'orange';
      }

      if (value <= 40) {
        return 'yellow';
      }

      return '#2AE02A';
    },
  };

  constructor() {}

  ngOnInit(): void {
    // slider has not a full width initially
    this.show$ = timer(400).pipe(
      map(() => {
        this.manualRefresh.emit();
        return true;
      }),
    );
  }

  didChange(newValue: number) {
    this.changes.emit(newValue);
  }
}
