import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IceBreakerType,
  PriceConditionsResult,
} from '../../../ice-breaker-template-messages';
import { PRICE_CONFIG } from '../../../price-config';

@Component({
  selector: 'app-price-conditions',
  templateUrl: './price-conditions.component.html',
  styleUrls: ['./price-conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceConditionsComponent {
  @Input() iceBreakerType: IceBreakerType = IceBreakerType.I_WILL_PAY;
  @Output() priceConditionsFinished: EventEmitter<PriceConditionsResult> =
    new EventEmitter<PriceConditionsResult>();
  @Output() stepBack = new EventEmitter<unknown>();

  readonly ICE_BREAKER_TYPES = IceBreakerType;
  readonly PRICE_CONFIG = PRICE_CONFIG;

  pricePerPerson = 0;
  countOfPersons = 0;

  setPriceOfPerson(price: number): void {
    this.pricePerPerson = price;
  }

  setCountOfPersons(count: number): void {
    this.countOfPersons = count;
  }

  finishPay(): void {
    this.priceConditionsFinished.emit({
      price: this.pricePerPerson * this.countOfPersons,
      countOfPeople: this.countOfPersons,
    });
  }

  setPriceOfIceBreaker(price: number): void {
    this.priceConditionsFinished.emit({ price, countOfPeople: 0 });
  }
}
