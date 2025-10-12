import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsfeedAvpresentationVideoComponent } from './newsfeed-avpresentation-video.component';

describe('NewsfeedAvpresentationVideoComponent', () => {
  let component: NewsfeedAvpresentationVideoComponent;
  let fixture: ComponentFixture<NewsfeedAvpresentationVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewsfeedAvpresentationVideoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedAvpresentationVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
