import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignUpMessageComponent } from './sign-up-message.component';

describe('SignUpMessageComponent', () => {
  let component: SignUpMessageComponent;
  let fixture: ComponentFixture<SignUpMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpMessageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
