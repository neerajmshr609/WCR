import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsfeedItemComponent } from './newsfeed-item.component';

describe('NewsfeedItemComponent', () => {
  let component: NewsfeedItemComponent;
  let fixture: ComponentFixture<NewsfeedItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewsfeedItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
