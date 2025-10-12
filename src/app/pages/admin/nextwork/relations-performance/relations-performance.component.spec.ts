import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RelationsPerformanceComponent } from './relations-performance.component';

describe('RelationsPerformanceComponent', () => {
  let component: RelationsPerformanceComponent;
  let fixture: ComponentFixture<RelationsPerformanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RelationsPerformanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
