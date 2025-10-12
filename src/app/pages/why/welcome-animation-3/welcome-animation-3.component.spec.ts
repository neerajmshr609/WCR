import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAnimation3Component } from './welcome-animation-3.component';

describe('WelcomeAnimationComponent', () => {
  let component: WelcomeAnimation3Component;
  let fixture: ComponentFixture<WelcomeAnimation3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeAnimation3Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeAnimation3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
