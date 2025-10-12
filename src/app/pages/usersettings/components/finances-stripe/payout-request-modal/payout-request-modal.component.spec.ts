import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutRequestModalComponent } from './payout-request-modal.component';

describe('PayoutRequestModalComponent', () => {
  let component: PayoutRequestModalComponent;
  let fixture: ComponentFixture<PayoutRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayoutRequestModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
