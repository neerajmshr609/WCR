import { PortalInjector } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';

export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');

@Injectable({
  providedIn: 'root',
})
export class InjectorService {
  constructor(private injector: Injector) {}

  createInjector(dataToPass): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(CONTAINER_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
  }
}
