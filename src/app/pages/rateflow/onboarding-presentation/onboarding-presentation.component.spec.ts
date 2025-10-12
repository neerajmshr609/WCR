import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnboardingPresentationComponent } from './onboarding-presentation.component';

describe('OnboardingPresentationComponent', () => {
  let component: OnboardingPresentationComponent;
  let fixture: ComponentFixture<OnboardingPresentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingPresentationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
