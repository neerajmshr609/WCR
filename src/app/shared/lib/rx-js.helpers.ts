import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const isNotAnyOf = (...flags: Observable<boolean>[]) => combineLatest([...flags])
  .pipe(
    take(1),
    filter(flags => !flags.some(is => is)),
  );

export const emitIfAllTrue = (...flags: Observable<boolean>[]) => combineLatest([...flags])
  .pipe(
    take(1),
    filter(flags => !flags.some(is => !is)),
  );