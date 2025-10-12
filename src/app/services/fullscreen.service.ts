import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FullScreenState {
  forDevice: ('desktop' | 'mobile' | 'tablet')[];
}

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  private fullScreen = new BehaviorSubject<void | FullScreenState>(null);
  public fullScreen$ = this.fullScreen.asObservable();

  public setFullScreen(state: FullScreenState) {
    this.fullScreen.next(state);
  }

  public resetFullScreenState() {
    this.fullScreen.next(null);
  }
}
