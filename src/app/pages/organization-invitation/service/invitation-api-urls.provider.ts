import { ApiUrlsProvider } from '../../../shared/lib/api-urls-provider.lib';
import { environment } from '../../../../environments/environment';


export const INVITATION_API_URLS: ApiUrlsProvider = {
  GET: environment.apiUrl + 'organizations/get_invite_info',
  POST: environment.apiUrl + 'organizations/user_accept_invitation',
  DELETE: environment.apiUrl + 'organizations/user_reject_invitation',
} as const;