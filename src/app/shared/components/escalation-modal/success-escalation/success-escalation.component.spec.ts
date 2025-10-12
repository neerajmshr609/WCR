import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessEscalationComponent } from './success-escalation.component';

describe('SuccessEscalationComponent', () => {
  let component: SuccessEscalationComponent;
  let fixture: ComponentFixture<SuccessEscalationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessEscalationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessEscalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
