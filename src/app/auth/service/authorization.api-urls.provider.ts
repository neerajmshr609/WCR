import { ApiUrlsProvider } from '../../shared/lib/api-urls-provider.lib';
import { environment } from '../../../environments/environment';

export const AUTHORIZATION_API_URLS: ApiUrlsProvider = {
  PATCH: environment.apiUrl + 'users',
};