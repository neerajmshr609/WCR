import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARTCATEGORY_API_URL_PROVIDER_KEY } from './artcategory-api-urls.provider';
import { ApiUrlsProvider } from '../../shared/lib/api-urls-provider.lib';
import { BehaviorSubject } from 'rxjs';
import { IArtCategory } from './model/response/artcategory.inteface';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ArtCategory, artCategoryFactory } from './model/artcategory.model';
import { createHttpParams } from '../../shared/functions/http-params';
import { isNotLoading } from '../../shared/lib/api-interaction.helpers';

@Injectable({
  providedIn: 'any',
})
export class ArtcategoriesService {
  constructor(
    @Inject(ARTCATEGORY_API_URL_PROVIDER_KEY)
    private readonly _artcategoryApiUrls: ApiUrlsProvider,
    private readonly _http: HttpClient,
  ) {
  }

  private readonly _artCategories$ = new BehaviorSubject<ArtCategory[]>([]);
  readonly artCategories$ = this._artCategories$.asObservable();
  private readonly _isLoading$ = new BehaviorSubject(false);
  readonly isLoading$ = this._isLoading$.asObservable();

  private _setLoadingStarts() {
    this._isLoading$.next(true);
  }

  private _setLoadingCompleted() {
    this._isLoading$.next(false);
  }

  private _setArtCategories(artCategories: ArtCategory[]) {
    this._artCategories$.next(artCategories);
  }

  fetchArtcategories(params: { bound_to_skill?: boolean } = {}) {
    isNotLoading(this)
      .pipe(
        switchMap(() => {
          this._setLoadingStarts();
          return this._http.get<IArtCategory[]>(this._artcategoryApiUrls.GET, { params: createHttpParams(params) });
        }),
        finalize(() => this._setLoadingCompleted()),
        map(artCategories => artCategories.map(_ => artCategoryFactory(_))),
      )
      .subscribe(_ => this._setArtCategories(_));
  }
}
