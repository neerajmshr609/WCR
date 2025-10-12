import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PRICE_CONFIG } from '../../../../../price-config';

@Component({
  selector: 'app-property-counter',
  templateUrl: './property-counter.component.html',
  styleUrls: ['./property-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCounterComponent {
  @Input() isDisabled = false;
  @Input() isCurrency = false;
  @Output() selectedCount: EventEmitter<number> = new EventEmitter<number>();
  readonly PRICE_CONFIG = PRICE_CONFIG;

  count = 0;

  isDisplaySlider = false;

  toggleChangeCount(): void {
    this.isDisplaySlider = !this.isDisplaySlider;
    if (this.count && !this.isDisplaySlider) {
      this.selectedCount.emit(this.count);
    }
  }
}
