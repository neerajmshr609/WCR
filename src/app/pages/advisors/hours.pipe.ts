import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours',
})
export class HoursPipe implements PipeTransform {
  transform(value: number): string {
    let res = '';
    const hours = Math.floor(value / 60 / 60);
    const minutes = Math.round(value / 60) % 60;

    if (hours) {
      res += hours + ' h';
    }

    if (minutes) {
      res += minutes + ' min';
    }

    return res;
  }
}
