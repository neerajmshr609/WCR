import { createApiUrlsProviderFactory } from '../../shared/lib/api-urls-provider.lib';

export const ARTCATEGORY_API_URL_PROVIDER_KEY = 'ARTCATEGORY_API_URLS';
export const createArtcategoriesApiUrlsProvider = createApiUrlsProviderFactory(ARTCATEGORY_API_URL_PROVIDER_KEY);