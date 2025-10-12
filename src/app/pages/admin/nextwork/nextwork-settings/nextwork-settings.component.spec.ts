import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NextworkSettingsComponent } from './nextwork-settings.component';

describe('NextworkSettingsComponent', () => {
  let component: NextworkSettingsComponent;
  let fixture: ComponentFixture<NextworkSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NextworkSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextworkSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
