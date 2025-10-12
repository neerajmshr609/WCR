import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallInviteComponent } from './video-call-invite.component';

describe('VideoCallInviteComponent', () => {
  let component: VideoCallInviteComponent;
  let fixture: ComponentFixture<VideoCallInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCallInviteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCallInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
