import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'greytDate',
})
export class GreytDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return `${format(date, 'EEEE do')} of ${format(date, 'MMMM HH:mm')}`;
  }
}
