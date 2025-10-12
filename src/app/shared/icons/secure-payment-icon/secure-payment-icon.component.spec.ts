import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurePaymentIconComponent } from './secure-payment-icon.component';

describe('SecurePaymentIconComponent', () => {
  let component: SecurePaymentIconComponent;
  let fixture: ComponentFixture<SecurePaymentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurePaymentIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurePaymentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
