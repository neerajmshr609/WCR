import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent extends BaseComponent implements OnInit {
  public currentPage: string;

  constructor(
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchService.currentPage$
      .pipe(
        takeUntil(this.destroyed),
        tap((res) => {
          this.currentPage = res;
          this.cdr.detectChanges();
        }),
      )
      .subscribe();
  }
}
