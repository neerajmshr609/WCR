import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeBankCardFormComponent } from './stripe-bank-card-form.component';

describe('StripeBankCardFormComponent', () => {
  let component: StripeBankCardFormComponent;
  let fixture: ComponentFixture<StripeBankCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StripeBankCardFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeBankCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
