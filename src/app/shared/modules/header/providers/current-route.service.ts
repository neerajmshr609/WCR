import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentRouteService {
  public pathTitle = new BehaviorSubject(null);
}
