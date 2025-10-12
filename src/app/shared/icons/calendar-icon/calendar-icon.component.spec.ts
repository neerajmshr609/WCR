import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIconComponent } from './calendar-icon.component';

describe('CallendarIconComponent', () => {
  let component: CalendarIconComponent;
  let fixture: ComponentFixture<CalendarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
