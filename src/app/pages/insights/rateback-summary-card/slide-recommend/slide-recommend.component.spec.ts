import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideRecommendComponent } from './slide-recommend.component';

describe('SlideRecommendComponent', () => {
  let component: SlideRecommendComponent;
  let fixture: ComponentFixture<SlideRecommendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlideRecommendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
