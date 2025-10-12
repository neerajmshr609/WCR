import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';

const getErrorMessage = (maxRetry: number) => {
  return 'Tried to load resource ' + maxRetry + ' times, giving up';
};

const DEFAULT_MAX_RETRIES = 5;

export function delayedRetry(delayMS: number, maxRetry = DEFAULT_MAX_RETRIES) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors) =>
        errors.pipe(
          delay(delayMS),
          mergeMap((error) =>
            retries-- > 0 ? of(error) : throwError(getErrorMessage(maxRetry)),
          ),
        ),
      ),
    );
}
