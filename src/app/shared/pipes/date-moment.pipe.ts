import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'datemoment',
})
export class DateMomentPipe implements PipeTransform {
  constructor() {}

  transform(value: number): any {
    if (value !== null) {
      const result = moment.unix(value).format('MMM Do YYYY');
      return result;
    }
    return '';
  }
}
