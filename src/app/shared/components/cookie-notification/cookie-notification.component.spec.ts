import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CookieNotificationComponent } from './cookie-notification.component';

describe('CookieNotificationComponent', () => {
  let component: CookieNotificationComponent;
  let fixture: ComponentFixture<CookieNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CookieNotificationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
