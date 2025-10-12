import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly _displayFooter$ = new BehaviorSubject<boolean>(true);
  readonly displayFooter$ = this._displayFooter$.asObservable();

  private readonly _height$ = new BehaviorSubject(0);
  readonly height$ = this._height$.asObservable();

  updateHeight(height: number) {
    this._height$.next(height);
  }

  hideFooter() {
    this._displayFooter$.next(false);
  }

  displayFooter() {
    return this._displayFooter$.next(true);
  }
}
