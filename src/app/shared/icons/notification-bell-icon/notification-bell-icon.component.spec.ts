import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBellIconComponent } from './notification-bell-icon.component';

describe('NotificationBellIconComponent', () => {
  let component: NotificationBellIconComponent;
  let fixture: ComponentFixture<NotificationBellIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationBellIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationBellIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
