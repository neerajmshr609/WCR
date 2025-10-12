import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminRateflowComponent } from './admin-rateflow.component';

describe('AdminRateflowComponent', () => {
  let component: AdminRateflowComponent;
  let fixture: ComponentFixture<AdminRateflowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRateflowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRateflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
