import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSignUpComponent } from './icon-sign-up.component';

describe('IconSignUpComponent', () => {
  let component: IconSignUpComponent;
  let fixture: ComponentFixture<IconSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSignUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
