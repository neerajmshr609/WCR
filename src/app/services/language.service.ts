import { computed, Injectable, Injector, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LOCATION_INITIALIZED } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGES_CODE,
  LANGUAGES_CODE_TYPE,
  LANGUAGES_TITLES,
  LOCALE_NAMES,
} from '../shared/app-language/data';
import { getBrowserAcceptableLanguageCode } from '../shared/app-language/functions';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly _currentLanguageCode = signal(
    this._localStorageLanguageCode,
  );

  public readonly currentLanguageCode = computed(() =>
    this._currentLanguageCode(),
  );
  public readonly currentLanguageTitle = computed(
    () => LANGUAGES_TITLES[this._currentLanguageCode()],
  );
  public readonly currentLanguageLocale = computed(
    () => LOCALE_NAMES[this._currentLanguageCode()],
  );

  constructor(
    private readonly _http: HttpClient,
    private readonly _translateService: TranslateService,
    private readonly _injector: Injector,
  ) {}

  async execAppInitConfig() {
    await this._injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    this._translateService.addLangs(this._languagesCodes);
    this._translateService.setDefaultLang(DEFAULT_LANGUAGE_CODE);
    await this.setCurrentLanguage(
      this._localStorageLanguageCode || getBrowserAcceptableLanguageCode(),
    );
  }

  private get _localStorageLanguageCode(): LANGUAGES_CODE_TYPE | null {
    // Source of truth
    return (localStorage.getItem('langCode') as LANGUAGES_CODE_TYPE) || null;
  }

  private set _localStorageLanguageCode(langCode: LANGUAGES_CODE_TYPE) {
    localStorage.setItem('langCode', langCode);
  }

  private get _languagesCodes() {
    return Object.values(LANGUAGES_CODE);
  }

  get languagesCodeTitle() {
    return Object.entries(LANGUAGES_TITLES) as [LANGUAGES_CODE_TYPE, string][];
  }

  get currentLanguageAndLocale():
    | readonly [LANGUAGES_CODE_TYPE, string]
    | null {
    const currentCode = this._localStorageLanguageCode;
    return currentCode ? [currentCode, LOCALE_NAMES[currentCode]] : null;
  }

  async setCurrentLanguage(langCode: LANGUAGES_CODE_TYPE) {
    this._localStorageLanguageCode = langCode;
    await firstValueFrom(this._translateService.use(langCode));
    this._currentLanguageCode.set(langCode);
  }
}
