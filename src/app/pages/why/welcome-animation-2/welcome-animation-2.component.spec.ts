import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAnimation2Component } from './welcome-animation-2.component';

describe('WelcomeAnimationComponent', () => {
  let component: WelcomeAnimation2Component;
  let fixture: ComponentFixture<WelcomeAnimation2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeAnimation2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeAnimation2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
