import { Pipe, PipeTransform } from '@angular/core';
import { IceBreaker } from '../../ice-breaker-template/ice-breaker-template-messages';

@Pipe({
  name: 'preselectedIceBreaker',
})
export class PreselectedIceBreakerPipe implements PipeTransform {
  transform(iceBreakers: IceBreaker[], iceBreakerId: number): IceBreaker[] {
    if (iceBreakerId) {
      const foundedIceBreaker = iceBreakers.filter(
        (ib: IceBreaker) => ib.id === iceBreakerId,
      );
      return foundedIceBreaker.length ? foundedIceBreaker : iceBreakers;
    }
    return iceBreakers;
  }
}
