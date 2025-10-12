import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCardFormModalComponent } from './bank-card-form-modal.component';

describe('BankCardFormModalComponent', () => {
  let component: BankCardFormModalComponent;
  let fixture: ComponentFixture<BankCardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankCardFormModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
