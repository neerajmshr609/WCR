import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

type HttpRequestMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'PATCH';

export type ApiUrlsProvider = Partial<{
  [key in HttpRequestMethods & PropertyKey]: string;
}>;

export const createApiUrlsProviderFactory = (
  providerKey: string | InjectionToken<string>,
) => {
  return (params: ApiUrlsProvider): Provider => {
    const urls: ApiUrlsProvider = {};
    for (const key in params) {
      urls[key] = environment.apiUrl + params[key];
    }
    return {
      provide: providerKey,
      useValue: urls,
    };
  };
};
