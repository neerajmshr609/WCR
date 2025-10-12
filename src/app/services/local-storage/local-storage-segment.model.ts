import { BehaviorSubject, Observable } from 'rxjs';

export class LocalStorageSegment<T extends object> {
  private readonly _segmentState$: BehaviorSubject<Partial<T>>;
  readonly localStorageState$: Observable<Partial<T>>;

  // backward compatibility
  private _state: Partial<T>;

  constructor(private readonly _segmentKey: string) {
    this._segmentState$ = new BehaviorSubject(this._initializeSegmentValue());
    this.localStorageState$ = this._segmentState$.asObservable();
    // backward compatibility
    this._subscribeOnStorageState();
  }

  private _initializeSegmentValue() {
    const value = window.localStorage.getItem(this._segmentKey);
    if (!value) {
      window.localStorage.setItem(this._segmentKey, '{}');
    }
    return this._localStorage;
  }

  private get _localStorage(): Partial<T> {
    const value = window.localStorage.getItem(this._segmentKey);
    return JSON.parse(value) as Partial<T>;
  }

  updateState(state: Partial<T>) {
    const newState = { ...this._localStorage, ...state };
    window.localStorage.setItem(this._segmentKey, JSON.stringify(newState));
    this._segmentState$.next(newState);
  }

  replaceState(state: Partial<T>) {
    const newState = { ...state };
    window.localStorage.setItem(this._segmentKey, JSON.stringify(newState));
    this._segmentState$.next(newState);
  }

  clearState() {
    this.replaceState({});
  }

  private _subscribeOnStorageState() {
    // backward compatibility
    this.localStorageState$.subscribe((state) => {
      this._state = state;
    });
  }

  getStorageValue(key: keyof T) {
    // backward compatibility
    return this._state[key];
  }
}
