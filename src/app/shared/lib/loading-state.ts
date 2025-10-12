import { BehaviorSubject } from 'rxjs';
import { isNotLoading } from './api-interaction.helpers';
import { map } from 'rxjs/operators';

export class LoadingState {
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading$.asObservable();
  readonly isNotLoading$ = this.isLoading$.pipe(map((_) => !_));

  startLoading() {
    this._isLoading$.next(true);
  }

  completeLoading() {
    this._isLoading$.next(false);
  }

  emitIfIsNotLoading() {
    return isNotLoading(this);
  }
}
