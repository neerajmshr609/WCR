import { ApiUrlsProvider } from '../../../shared/lib/api-urls-provider.lib';
import { environment } from '../../../../environments/environment';

export const OPEN_REQUESTS_API_URLS: ApiUrlsProvider = {
  GET: environment.apiUrl + 'available_open_requests',
} as const;

export const OPEN_REQUESTS_ADD_TO_QUEUE_API_URLS: ApiUrlsProvider = {
  POST: environment.apiUrl + 'add_to_review_queue',
} as const;

export const OPEN_REQUESTS_REMOVE_TO_QUEUE_API_URLS = {
  DELETE: environment.apiUrl + 'remove_from_review_queue',
} as const;
