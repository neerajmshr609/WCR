import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitJourneyName',
})
export class SplitJourneyNamePipe implements PipeTransform {
  transform(value: string, shouldSplit: boolean): string {
    if (shouldSplit) {
      return value.split(' ')[0];
    }
    return value;
  }
}
