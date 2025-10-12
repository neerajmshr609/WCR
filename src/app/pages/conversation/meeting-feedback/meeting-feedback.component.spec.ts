import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeetingFeedbackComponent } from './meeting-feedback.component';

describe('MeetingFeedbackComponent', () => {
  let component: MeetingFeedbackComponent;
  let fixture: ComponentFixture<MeetingFeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingFeedbackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
