import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSelectorComponent } from './feedback-selector.component';

describe('FeedbackSelectorComponent', () => {
  let component: FeedbackSelectorComponent;
  let fixture: ComponentFixture<FeedbackSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
