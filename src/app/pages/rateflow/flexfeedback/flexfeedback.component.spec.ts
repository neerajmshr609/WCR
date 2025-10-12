import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlexfeedbackComponent } from './flexfeedback.component';

describe('FlexfeedbackComponent', () => {
  let component: FlexfeedbackComponent;
  let fixture: ComponentFixture<FlexfeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlexfeedbackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
