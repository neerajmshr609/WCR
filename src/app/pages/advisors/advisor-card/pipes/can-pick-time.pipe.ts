import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'canPickTime',
})
export class CanPickTimePipe implements PipeTransform {
  transform(time: string, selectedDate: string): boolean {
    const isSameDate = moment().isSame(moment(selectedDate), 'date');
    if (isSameDate) {
      const currentDate = moment();
      const [hours, minutes] = time.split(':');
      return currentDate.isAfter(
        moment(selectedDate).set({ hour: +hours, minute: +minutes }),
      );
    }
    return false;
  }
}
