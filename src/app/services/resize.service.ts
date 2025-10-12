import { Injectable } from '@angular/core';
import { combineLatest, fromEvent, merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';

@Injectable()
export class ResizeService {
  private readonly _BREAKPOINTS = {
    DESKTOP: 1280,
    MEDIUM: 940,
    SMALL: 768,
    SMALLEST: 400, // I don't know what for is it
  } as const;

  readonly resize$ = merge(
    fromEvent(window, 'resize'),
    fromEvent(window, 'orientationchange'),
  ).pipe(
    map((_: Event & { target: Window }) => window.innerWidth),
    startWith(window.innerWidth),
  );

  readonly isDesktop$ = this.resize$.pipe(
    map((_) => _ >= this._BREAKPOINTS.DESKTOP),
    distinctUntilChanged(),
  );

  readonly isNotDesktopScreen$ = this.resize$.pipe(
    map((_) => _ < this._BREAKPOINTS.DESKTOP),
    distinctUntilChanged(),
  );

  readonly isMedium$ = this.resize$.pipe(
    map((_) => _ < this._BREAKPOINTS.DESKTOP && _ >= this._BREAKPOINTS.MEDIUM),
    distinctUntilChanged(),
  );
  readonly isMediumMaxWidth$ = this.resize$.pipe(
    map((_) => _ <= this._BREAKPOINTS.MEDIUM),
    distinctUntilChanged(),
  );
  readonly isSmall$ = this.resize$.pipe(
    map((_) => _ < this._BREAKPOINTS.MEDIUM && _ >= this._BREAKPOINTS.SMALL),
    distinctUntilChanged(),
  );

  readonly isNotSmall$ = this.resize$.pipe(
    map((_) => _ >= this._BREAKPOINTS.MEDIUM),
    distinctUntilChanged(),
  );

  readonly isSmallest$ = this.resize$.pipe(
    map((_) => _ < this._BREAKPOINTS.SMALL),
    distinctUntilChanged(),
  );

  readonly sizeOfDevice$ = combineLatest([
    this.isDesktop$,
    this.isMedium$,
    this.isSmall$,
  ]).pipe(
    map(([isLarge, isMedium, isSmall]) => ({ isLarge, isMedium, isSmall })),
  );
}
