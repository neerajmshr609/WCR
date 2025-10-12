import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationModalComponent } from './escalation-modal.component';

describe('EscalationModalComponent', () => {
  let component: EscalationModalComponent;
  let fixture: ComponentFixture<EscalationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EscalationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EscalationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
