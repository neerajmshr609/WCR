import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFocusAreaComponent } from './feedback-focus-area.component';

describe('FeedbackFocusAreaComponent', () => {
  let component: FeedbackFocusAreaComponent;
  let fixture: ComponentFixture<FeedbackFocusAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackFocusAreaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackFocusAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
