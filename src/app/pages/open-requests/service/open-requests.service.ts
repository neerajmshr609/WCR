import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, switchMap, take } from 'rxjs/operators';
import {
  createConversation,
  OpenRequestConversation,
} from '../../../shared/models/conversation.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNotLoading } from '../../../shared/lib/api-interaction.helpers';
import {
  OPEN_REQUESTS_ADD_TO_QUEUE_API_URLS,
  OPEN_REQUESTS_API_URLS,
  OPEN_REQUESTS_REMOVE_TO_QUEUE_API_URLS,
} from './open-requests.api-urls.provider';
import { IAddToReviewQueueResponse } from '../model/responses/add-to-review-queue-response.interface';
import { IOpenRequestResponse } from '../model/responses/open-request-response.interface';
import {
  convertIntoHttpParams,
  IGetAvailableOpenRequestsParams,
} from '../model/request/get-available-open-requests-params.interface';

@Injectable({
  providedIn: 'any',
})
export class OpenRequestsService {
  private readonly _openRequests$ = new BehaviorSubject<
    OpenRequestConversation[]
  >([]);
  readonly openRequests$ = this._openRequests$.asObservable();
  private readonly _isLoading$ = new BehaviorSubject(false);
  readonly isLoading$ = this._isLoading$.asObservable();
  private readonly _hasMorePages$ = new BehaviorSubject<boolean>(true);
  readonly hasMorePages$ = this._hasMorePages$.asObservable();
  private readonly _totalCount$ = new BehaviorSubject<number>(0);
  readonly totalCount$ = this._totalCount$.asObservable();
  private _currentPage = 0;
  private readonly ITEMS_PER_PAGE = 10;

  constructor(private readonly _httpClient: HttpClient) {}

  private _startLoading() {
    this._isLoading$.next(true);
  }

  private _completeLoading() {
    this._isLoading$.next(false);
  }

  fetchOpenRequests(
    params: IGetAvailableOpenRequestsParams = {},
    reset = true,
  ) {
    if (reset) {
      this._currentPage = 0;
      this._openRequests$.next([]);
      this._hasMorePages$.next(true);
    }

    if (!this._hasMorePages$.value || this._isLoading$.value) {
      return;
    }

    isNotLoading(this)
      .pipe(
        switchMap(() => {
          this._startLoading();
          const httpParams = convertIntoHttpParams({
            ...params,
            page: this._currentPage,
            limit: this.ITEMS_PER_PAGE,
          });
          return this._httpClient.get<IOpenRequestResponse>(
            OPEN_REQUESTS_API_URLS.GET,
            { params: httpParams },
          );
        }),
        finalize(() => this._completeLoading()),
        map(({ conversations, total_count }) => {
          const totalCount =
            total_count ?? (this._currentPage + 1) * this.ITEMS_PER_PAGE;
          this._totalCount$.next(totalCount);
          const hasMore = conversations.data.length === this.ITEMS_PER_PAGE;

          this._hasMorePages$.next(hasMore);
          return conversations.data.map(createConversation);
        }),
      )
      .subscribe((conversations) => {
        const currentRequests = this._openRequests$.value;
        this._openRequests$.next([
          ...currentRequests,
          ...(conversations as OpenRequestConversation[]),
        ]);
      });
  }

  loadNextPage(params: IGetAvailableOpenRequestsParams = {}) {
    this._currentPage++;
    this.fetchOpenRequests(params, false);
  }

  public upsert(withOpenRequest: OpenRequestConversation) {
    this._openRequests$.pipe(take(1)).subscribe((openRequests) => {
      const newState = [...openRequests];
      const existingIndex = newState.findIndex(
        (openRequest) => openRequest.id === withOpenRequest.id,
      );
      if (existingIndex === -1) {
        newState.push(withOpenRequest);
      } else {
        newState[existingIndex] =
          newState[existingIndex].updateState(withOpenRequest);
      }
      this._openRequests$.next(newState);
    });
  }

  addToReviewQueue(openRequest: OpenRequestConversation) {
    if (openRequest.is_in_review_queue) {
      return;
    }
    this._httpClient
      .post<IAddToReviewQueueResponse>(
        OPEN_REQUESTS_ADD_TO_QUEUE_API_URLS.POST,
        openRequest.toConversationIdRequestBody(),
      )
      .pipe(
        map(
          (_) => createConversation(_.conversation) as OpenRequestConversation,
        ),
      )
      .subscribe((_) => {
        this.upsert(_);
      });
  }

  removeFromReviewQueue(
    conversation_id: number,
  ): Observable<{ message: string }> {
    return this._httpClient.delete<{ message: string }>(
      OPEN_REQUESTS_REMOVE_TO_QUEUE_API_URLS.DELETE,
      { body: { conversation_id } },
    );
  }

  // ------> nextPage()
  // ------> prevPage()
  // ------> changeOrder()
  // ------> addFilter()
  // ------> removeFilter()
  // ------> so on ...
}
