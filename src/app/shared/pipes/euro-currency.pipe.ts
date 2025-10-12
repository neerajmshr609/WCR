import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroCurrency',
})
export class EuroCurrencyPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en');

  transform(value: number, digitsInfo = '0.0-2'): string {
    return (
      this.currencyPipe.transform(value, 'EUR', 'symbol', digitsInfo) || '-.-'
    );
  }
}
