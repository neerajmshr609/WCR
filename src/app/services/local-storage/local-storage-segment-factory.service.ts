import { Injectable } from '@angular/core';
import { LocalStorageSegment } from './local-storage-segment.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageSegmentFactoryService {
  private _segmentsCache = new Map<string, LocalStorageSegment<object>>(null);

  getExistingOrCreate<T extends object>(key: string) {
    let segment = this._segmentsCache.get(key) as LocalStorageSegment<T>;
    if (!segment) {
      segment = new LocalStorageSegment<T>(key);
      // @ts-ignore
      this._segmentsCache.set(key, segment);
    }
    return segment;
  }
}
