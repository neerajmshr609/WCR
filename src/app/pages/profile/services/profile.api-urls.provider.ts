import { ApiUrlsProvider } from '@helpers-lib/api-urls-provider.lib';
import { environment } from '../../../../environments/environment';

export const PROFILE_API_URLS: ApiUrlsProvider = {
  GET: environment.apiUrl + 'users',
};

export const ADVISOR_PROFILE_API_URLS: ApiUrlsProvider = {
  GET: environment.apiUrl + 'advisor_user_profile',
};

export const PROFILE_EMAIL_NOTIFICATION_API_URLS: ApiUrlsProvider = {
  PUT: environment.apiUrl + 'mute_unmute_conversations',
};

export const USER_PROFILE_ORGANIZATION_MEMBER_API_URLS: ApiUrlsProvider = {
  PUT: environment.apiUrl + 'org_members',
};

export const ICE_BREAKER_API_URLS: ApiUrlsProvider = {
  DELETE: environment.apiUrl + 'icebreakers',
};
