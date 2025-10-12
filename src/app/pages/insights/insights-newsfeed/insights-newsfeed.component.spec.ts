import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsNewsfeedComponent } from './insights-newsfeed.component';

describe('InsightsNewsfeedComponent', () => {
  let component: InsightsNewsfeedComponent;
  let fixture: ComponentFixture<InsightsNewsfeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsNewsfeedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsNewsfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
