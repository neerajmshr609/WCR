import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarCategoriesComponent } from './search-bar-categories.component';

describe('SearchBarCategoriesComponent', () => {
  let component: SearchBarCategoriesComponent;
  let fixture: ComponentFixture<SearchBarCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarCategoriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
