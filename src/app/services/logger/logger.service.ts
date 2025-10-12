import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class LoggerService {
  private _isDevelopmentMode() {
    return environment.mode === 'development';
  }

  log(...args: any[]) {
    console.log(...args);
  }

  debug(...args: any[]) {
    if (!this._isDevelopmentMode()) {
      this.log(...args);
    }
  }

  subscribeDebugLog(prefixMessage: string, data$: Observable<unknown>) {
    if (!this._isDevelopmentMode()) {
      let time = Date.now();
      data$
        .subscribe(data => {
          const currentTime = Date.now();
          const passedMs = currentTime - time;
          time = currentTime;
          this.log(prefixMessage, `(from prev change +${passedMs}ms)`, data);
        });
    }
  }

  errorWithDescription(description: string, error: Error) {
    if (!environment.production) {
      console.error(`Got error: ${description}`);
      console.error(error);
    }
  }

  error(...args: any[]) {
    if (!environment.production) {
      console.error(...args);
    }
  }
}
