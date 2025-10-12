import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GtSwitchComponent } from './gt-switch.component';

describe('GtSwitchComponent', () => {
  let component: GtSwitchComponent;
  let fixture: ComponentFixture<GtSwitchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GtSwitchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
