import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentSliderComponent } from './payment-slider.component';

describe('PaymentSliderComponent', () => {
  let component: PaymentSliderComponent;
  let fixture: ComponentFixture<PaymentSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSliderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
