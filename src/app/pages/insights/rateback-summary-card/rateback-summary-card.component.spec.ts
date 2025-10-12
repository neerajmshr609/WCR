import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatebackSummaryCardComponent } from './rateback-summary-card.component';

describe('RatebackSummaryCardComponent', () => {
  let component: RatebackSummaryCardComponent;
  let fixture: ComponentFixture<RatebackSummaryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RatebackSummaryCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatebackSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
