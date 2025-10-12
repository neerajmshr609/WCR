import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsSkillsComponent } from './search-results-skills.component';

describe('SearchResultsSkillsComponent', () => {
  let component: SearchResultsSkillsComponent;
  let fixture: ComponentFixture<SearchResultsSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultsSkillsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
