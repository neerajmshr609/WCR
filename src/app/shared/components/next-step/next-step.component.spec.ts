import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextStepComponent } from './next-step.component';

describe('NextStepComponent', () => {
  let component: NextStepComponent;
  let fixture: ComponentFixture<NextStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NextStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
