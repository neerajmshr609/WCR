import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { LANGUAGES_CODE_TYPE } from '../app-language/data';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  private static readonly _acceptLanguageHeaderName = 'accept-language';
  private static _cachedAcceptLanguage: null | string = null;

  constructor(private readonly _languageService: LanguageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let requestClone = request.clone();
    const currentLanguageAndLocale =
      this._languageService.currentLanguageAndLocale;
    if (currentLanguageAndLocale) {
      const [langCode, langLocale] = currentLanguageAndLocale;
      requestClone = this._updateAcceptLanguageIfRequired(
        request,
        langCode,
        langLocale,
      );
    }
    return next.handle(requestClone);
  }

  private _updateAcceptLanguageIfRequired(
    request: HttpRequest<unknown>,
    curLangCode: LANGUAGES_CODE_TYPE,
    curLangLocale: string,
  ): HttpRequest<unknown> {
    const currentHeaderValue = request.headers.get(
      LanguageInterceptor._acceptLanguageHeaderName,
    );
    return currentHeaderValue &&
      (currentHeaderValue.startsWith(curLangCode) ||
        currentHeaderValue.startsWith(curLangLocale))
      ? request
      : LanguageInterceptor._cachedAcceptLanguage &&
          LanguageInterceptor._cachedAcceptLanguage.startsWith(curLangCode)
        ? this._createCloneAndSetCachedHeader(request)
        : this._createCloneWithUpdatedHeader(
            request,
            curLangCode,
            curLangLocale,
          );
  }

  private _createCloneAndSetCachedHeader(
    request: HttpRequest<unknown>,
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        [LanguageInterceptor._acceptLanguageHeaderName]:
          LanguageInterceptor._cachedAcceptLanguage,
      },
    });
  }

  private _createCloneWithUpdatedHeader(
    request: HttpRequest<unknown>,
    curLangCode: LANGUAGES_CODE_TYPE,
    curLangLocale: string,
  ): HttpRequest<unknown> {
    const headerAcceptedLanguages = this._parseAndSplitLanguagesFrom(
      request,
      curLangCode,
    );
    headerAcceptedLanguages.unshift([curLangLocale, curLangCode]);
    this._appendNavigatorLanguages(headerAcceptedLanguages);
    LanguageInterceptor._cachedAcceptLanguage =
      this._setQWeightsOfAcceptLanguage(headerAcceptedLanguages).join(';');
    return this._createCloneAndSetCachedHeader(request);
  }

  private _parseAndSplitLanguagesFrom(
    request: HttpRequest<unknown>,
    curLangCode: LANGUAGES_CODE_TYPE,
  ) {
    return (
      request.headers.get(LanguageInterceptor._acceptLanguageHeaderName) || ''
    )
      .split(';')
      .map((acceptLang) =>
        acceptLang.replace(/q=0\.\d{1,3},*\s*/, '').split(/,\s*/),
      )
      .filter(
        ([acceptLangCode]) =>
          acceptLangCode?.length && !acceptLangCode.includes(curLangCode),
      );
  }

  private _appendNavigatorLanguages(languagesAndLocales: string[][]) {
    window.navigator.languages.forEach((navigatorLang) => {
      const match = navigatorLang.match(/\w+(?=($|-))/);
      if (match) {
        const [navigatorLangCode] = match;
        if (
          !languagesAndLocales.find(([langCode]) =>
            langCode.startsWith(navigatorLangCode),
          )
        ) {
          languagesAndLocales.push([navigatorLang]);
        }
      }
    });
  }

  private _setQWeightsOfAcceptLanguage(headerAcceptedLanguages: string[][]) {
    const acceptLangsQWeight = [];
    for (
      let k = 10, index = 0, q = 0;
      k >= 0 && index < headerAcceptedLanguages.length;
      k--, index++, q = k / 10
    ) {
      const headerPart = headerAcceptedLanguages[index];
      if (q) {
        headerPart.unshift(`q=${q}`);
      }
      acceptLangsQWeight.push(headerPart.join(', '));
    }
    return acceptLangsQWeight;
  }
}
