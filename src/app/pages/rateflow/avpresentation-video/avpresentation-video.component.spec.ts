import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvpresentationVideoComponent } from './avpresentation-video.component';

describe('AvpresentationVideoComponent', () => {
  let component: AvpresentationVideoComponent;
  let fixture: ComponentFixture<AvpresentationVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvpresentationVideoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvpresentationVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
