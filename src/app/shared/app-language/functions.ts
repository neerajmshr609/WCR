import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGES_CODE,
  LANGUAGES_CODE_TYPE,
} from './data';

export function getBrowserAcceptableLanguageCode() {
  // This method requires when user loading application with empty local storage to define user acceptable language
  const appLanguagesCodes = Object.values(LANGUAGES_CODE);
  const prioritizedLanguages = window.navigator.languages;
  let selectedLangCode;
  for (const langCodeOrLocale of prioritizedLanguages) {
    const appCode = appLanguagesCodes.find((existingCode) =>
      langCodeOrLocale.includes(existingCode),
    );
    if (appCode) {
      selectedLangCode = appCode;
      break;
    }
  }

  if (!selectedLangCode) {
    selectedLangCode = DEFAULT_LANGUAGE_CODE;
  }

  return selectedLangCode as LANGUAGES_CODE_TYPE;
}
