import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencies',
})
export class CurrenciesPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number, currency: string): string {
    if (value != null) {
      const symbol = currency.toUpperCase();
      return this.currencyPipe.transform(
        (value / 100).toFixed(2),
        symbol,
        'symbol',
      );
    }
    return '€0.00';
  }
}
