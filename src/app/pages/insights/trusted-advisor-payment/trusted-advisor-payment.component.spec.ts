import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedAdvisorPaymentComponent } from './trusted-advisor-payment.component';

describe('TrustedAdvisorPaymentComponent', () => {
  let component: TrustedAdvisorPaymentComponent;
  let fixture: ComponentFixture<TrustedAdvisorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustedAdvisorPaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustedAdvisorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
