import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly _height$ = new BehaviorSubject(0);
  readonly height$ = this._height$.asObservable();
  readonly heightPx$ = this.height$.pipe(map((_) => `${_}px`));

  updateHeight(height: number) {
    this._height$.next(height);
  }
}
