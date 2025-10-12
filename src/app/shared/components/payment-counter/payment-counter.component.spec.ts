import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentCounterComponent } from './payment-counter.component';

describe('PaymentCounterComponent', () => {
  let component: PaymentCounterComponent;
  let fixture: ComponentFixture<PaymentCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCounterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
