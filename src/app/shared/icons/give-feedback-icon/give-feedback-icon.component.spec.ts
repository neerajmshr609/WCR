import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveFeedbackIconComponent } from './give-feedback-icon.component';

describe('GiveFeedbackIconComponent', () => {
  let component: GiveFeedbackIconComponent;
  let fixture: ComponentFixture<GiveFeedbackIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveFeedbackIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GiveFeedbackIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
