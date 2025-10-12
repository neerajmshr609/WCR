export interface Pagination {
  readonly oldestMessageId: number;
  readonly canLoadMore: boolean;
  readonly itemsPerPage: number;
}

export class PaginationState {
  private _currentPage = 1;
  private _totalCount = 0;
  constructor(private _step = 10) {}

  set totalCount(totalCount: number) {
    this._totalCount = totalCount;
  }
}
