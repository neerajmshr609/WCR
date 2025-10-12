import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent extends BaseComponent implements OnInit {
  constructor(public searchService: SearchService) {
    super();
  }

  ngOnInit(): void {}
}
