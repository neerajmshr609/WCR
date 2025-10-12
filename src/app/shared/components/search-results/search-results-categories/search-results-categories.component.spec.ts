import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsCategoriesComponent } from './search-results-categories.component';

describe('SearchResultsCategoriesComponent', () => {
  let component: SearchResultsCategoriesComponent;
  let fixture: ComponentFixture<SearchResultsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultsCategoriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
