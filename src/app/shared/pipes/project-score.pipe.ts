import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectScore',
})
export class ProjectScorePipe implements PipeTransform {
  transform(value: number): string {
    if (value === null) {
      return '_._';
    }
    if (value === 50) {
      return '0.0';
    }
    if (value === 0) {
      return '-5.0';
    }
    if (value > 50) {
      return this.getDecimal((value - 50) / 10, '+');
    }
    if (value < 50) {
      return this.getDecimal((50 - value) / 10, '-');
    }
  }

  private getDecimal(value: number, action: '+' | '-'): string {
    return `${action}${new DecimalPipe('en-US').transform(value, '1.1-1')}`;
  }
}
