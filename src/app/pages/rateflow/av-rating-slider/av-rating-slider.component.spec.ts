import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvRatingSliderComponent } from './av-rating-slider.component';

describe('AvRatingSliderComponent', () => {
  let component: AvRatingSliderComponent;
  let fixture: ComponentFixture<AvRatingSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvRatingSliderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvRatingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
