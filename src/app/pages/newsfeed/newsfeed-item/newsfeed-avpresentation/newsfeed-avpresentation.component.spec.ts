import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsfeedAvpresentationComponent } from './newsfeed-avpresentation.component';

describe('NewsfeedAvpresentationComponent', () => {
  let component: NewsfeedAvpresentationComponent;
  let fixture: ComponentFixture<NewsfeedAvpresentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewsfeedAvpresentationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedAvpresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
