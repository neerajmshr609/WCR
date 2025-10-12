import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarSkillsComponent } from './search-bar-skills.component';

describe('SearchBarSkillsComponent', () => {
  let component: SearchBarSkillsComponent;
  let fixture: ComponentFixture<SearchBarSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarSkillsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
