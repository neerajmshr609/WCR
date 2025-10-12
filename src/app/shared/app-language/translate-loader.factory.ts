import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { TRANSLATIONS_FOLDER } from './translate-module-provider-config.factory';

class TranslateFetchLoader extends TranslateLoader {
  constructor(private readonly _translationsPath: string) {
    super();
  }

  private async _fetchTranslation(lang: string) {
    const url = `${this._translationsPath}${lang}.json`;
    let translations;
    const response = await fetch(url);
    if (response.ok) {
      translations = await response.json();
    } else {
      console.error(`Failed to load translations ${url}`);
      translations = {};
    }
    return translations;
  }

  getTranslation(lang: string): Observable<any> {
    return fromPromise(this._fetchTranslation(lang));
  }
}

export const createTranslateLoaderFactoryProvider = (
  translationsPath?: string,
) => {
  const translationsFolder = translationsPath
    ? `${TRANSLATIONS_FOLDER}${translationsPath}/`
    : TRANSLATIONS_FOLDER;
  return {
    provide: TranslateLoader,
    useFactory: function () {
      return new TranslateFetchLoader(translationsFolder);
    },
  };
};
