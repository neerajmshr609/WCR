import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorsVerticalCarouselComponent } from './counselors-vertical-carousel.component';

describe('CounselorsVerticalSliderComponent', () => {
  let component: CounselorsVerticalCarouselComponent;
  let fixture: ComponentFixture<CounselorsVerticalCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounselorsVerticalCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounselorsVerticalCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
