import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconVideoCallComponent } from './icon-video-call.component';

describe('IconVideoCallComponent', () => {
  let component: IconVideoCallComponent;
  let fixture: ComponentFixture<IconVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconVideoCallComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
