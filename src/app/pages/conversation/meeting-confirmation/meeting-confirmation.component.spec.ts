import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeetingConfirmationComponent } from './meeting-confirmation.component';

describe('MeetingConfirmationComponent', () => {
  let component: MeetingConfirmationComponent;
  let fixture: ComponentFixture<MeetingConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingConfirmationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
