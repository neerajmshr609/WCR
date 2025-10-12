import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewScoreComponent } from './review-score.component';

describe('ReviewScoreComponent', () => {
  let component: ReviewScoreComponent;
  let fixture: ComponentFixture<ReviewScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewScoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
