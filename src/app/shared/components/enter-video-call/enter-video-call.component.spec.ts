import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterVideoCallComponent } from './enter-video-call.component';

describe('EnterVideoCallComponent', () => {
  let component: EnterVideoCallComponent;
  let fixture: ComponentFixture<EnterVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterVideoCallComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnterVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
