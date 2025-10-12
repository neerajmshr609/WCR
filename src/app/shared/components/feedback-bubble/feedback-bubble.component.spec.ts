import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackBubbleComponent } from './feedback-bubble.component';

describe('FeedbackBubbleComponent', () => {
  let component: FeedbackBubbleComponent;
  let fixture: ComponentFixture<FeedbackBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackBubbleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
