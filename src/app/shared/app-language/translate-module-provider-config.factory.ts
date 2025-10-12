import { TranslateModuleConfig } from '@ngx-translate/core/public_api';
import { DEFAULT_LANGUAGE_CODE } from './data';
import { createTranslateLoaderFactoryProvider } from './translate-loader.factory';

export const TRANSLATIONS_FOLDER = `./assets/translations/`;
export const DEFAULT_TRANSLATIONS_PROVIDER_CONFIG: TranslateModuleConfig = {
  defaultLanguage: DEFAULT_LANGUAGE_CODE,
  isolate: true,
};

export const createForChildProviderConfig = (
  translationsPath?: string,
): TranslateModuleConfig => ({
  ...DEFAULT_TRANSLATIONS_PROVIDER_CONFIG,
  loader: createTranslateLoaderFactoryProvider(translationsPath),
  isolate: true,
});

export const createForRootProviderConfig = () => ({
  ...DEFAULT_TRANSLATIONS_PROVIDER_CONFIG,
  loader: createTranslateLoaderFactoryProvider(),
});
