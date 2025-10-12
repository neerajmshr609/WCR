import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { InspiringFeedback } from '../models/project.model';

@Directive({
  selector: '[appPaymentFrequencyColor]',
})
export class PaymentFrequencyColorDirective implements OnChanges {
  @Input() appPaymentFrequencyColor: InspiringFeedback;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const frequency = this.appPaymentFrequencyColor.count
      ? this.appPaymentFrequencyColor.paid / this.appPaymentFrequencyColor.count
      : null;
    this.el.nativeElement.style.color = this.getColor(frequency);
  }

  getColor(value: number): string {
    if (value === null) {
      return '#B0B0B0';
    }
    if (value < 0.1) {
      return '#D9593C';
    }
    if (value < 0.2) {
      return '#E78961';
    }
    if (value < 0.3) {
      return '#D19F70';
    }
    if (value < 0.4) {
      return '#E0BC76';
    }
    if (value < 0.6) {
      return '#E3BE30';
    }
    if (value < 0.7) {
      return '#D6D959';
    }
    if (value < 0.8) {
      return '#B5D472';
    }
    if (value < 0.9) {
      return '#89D4A7';
    }
    return '#00C67E';
  }
}
