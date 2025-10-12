import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspiringFeedbacksComponent } from './inspiring-feedbacks.component';

describe('InspiringFeedbacksComponent', () => {
  let component: InspiringFeedbacksComponent;
  let fixture: ComponentFixture<InspiringFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspiringFeedbacksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspiringFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
