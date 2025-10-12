import { createApiUrlsProviderFactory } from '../../shared/lib/api-urls-provider.lib';

export const SKILL_API_URL_PROVIDER_KEY = 'SKILL_API_URLS';

export const createSkillApiUrlsProvider = createApiUrlsProviderFactory(SKILL_API_URL_PROVIDER_KEY);