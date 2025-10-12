import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Artcategory } from 'src/app/shared/models/artcategory.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results-categories',
  templateUrl: './search-results-categories.component.html',
  styleUrls: ['./search-results-categories.component.scss'],
})
export class SearchResultsCategoriesComponent
  extends BaseComponent
  implements OnInit
{
  @Input() public categories: Artcategory[];

  constructor(
    private router: Router,
    private searchService: SearchService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed),
        filter((event) => event instanceof NavigationEnd),
        tap(() => this.updateCategoriesSubscription([])),
      )
      .subscribe();
  }

  removeSearchResult(option: Artcategory) {
    this.updateCategoriesSubscription(
      this.categories.filter((item) => item.id !== option.id),
    );
  }

  updateCategoriesSubscription(categories) {
    this.searchService.selectedCategories$.next(categories);
  }
}
