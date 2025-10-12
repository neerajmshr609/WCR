import { Pipe, PipeTransform } from '@angular/core';
import { Decimal } from 'decimal.js';

@Pipe({
  name: 'hms',
})
export class HmsPipe implements PipeTransform {
  transform(value: number, type: 'withUnits' | 'default' = 'default'): string {
    if (value == null) {
      return;
    }

    const seconds = new Decimal(value);

    const h: number = seconds.div(3600).floor().toNumber();
    const m: number = seconds.mod(3600).div(60).floor().toNumber();
    const s: number = seconds.mod(3600).mod(60).floor().toNumber();

    let hDisplay;
    let mDisplay;
    let sDisplay;

    if (type === 'withUnits') {
      hDisplay = h > 0 ? `${h} h ` : '';
      mDisplay = `${m} min `;
      sDisplay = s > 0 ? `${s} s` : '';
    } else {
      hDisplay = h > 0 ? `${h.toString().padStart(2, '0')}:` : '';
      mDisplay = `${m.toString().padStart(2, '0')}:`;
      sDisplay = `${s.toString().padStart(2, '0')}`;
    }

    return hDisplay + mDisplay + sDisplay;
  }
}
