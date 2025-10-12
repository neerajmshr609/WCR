import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

type LoadableState = {
  readonly isLoading$: Observable<boolean>;
};

export const isNotLoading = (loadableState: LoadableState) => {
  return loadableState.isLoading$.pipe(take(1), filter(is => !is));
};

export const areLoading = (...loadingFlags: Observable<boolean>[]) => combineLatest([...loadingFlags])
  .pipe(map(loadings => loadings.some(is => is)));