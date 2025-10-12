import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PRICE_CONFIG } from '../../../../../../ice-breaker-template/price-config';
import {
  IceBreaker,
  IceBreakerType,
} from '../../../../../../ice-breaker-template/ice-breaker-template-messages';

@Component({
  selector: 'app-owner-ice-breaker-btn',
  templateUrl: './owner-ice-breaker-btn.component.html',
  styleUrls: ['./owner-ice-breaker-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerIceBreakerBtnComponent implements OnInit {
  @Input() price = 0;
  @Input() iceBreaker: IceBreaker;
  @Output() priceChanged: EventEmitter<number> = new EventEmitter<number>();
  newPrice: number;
  isCanChangePrice = false;
  readonly PRICE_CONFIG = PRICE_CONFIG;
  readonly ICE_BREAKER_TYPES = IceBreakerType;

  priceChange(newPrice: number): void {
    this.newPrice = newPrice;
  }

  ngOnInit() {
    this.newPrice = this.price;
  }

  toggleChangePrice(): void {
    this.isCanChangePrice = !this.isCanChangePrice;
    if (this.price !== this.newPrice && !this.isCanChangePrice) {
      this.priceChanged.emit(this.newPrice);
    }
  }
}
