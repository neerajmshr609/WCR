import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupAnimationComponent } from './signup-animation.component';

describe('SignupAnimationComponent', () => {
  let component: SignupAnimationComponent;
  let fixture: ComponentFixture<SignupAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupAnimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
