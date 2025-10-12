import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorScheduleComponent } from './advisor-schedule.component';

describe('AdvisorScheduleComponent', () => {
  let component: AdvisorScheduleComponent;
  let fixture: ComponentFixture<AdvisorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvisorScheduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
