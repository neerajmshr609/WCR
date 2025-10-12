import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSignUpModalComponent } from './success-sign-up-modal.component';

describe('SuccessSignUpModalComponent', () => {
  let component: SuccessSignUpModalComponent;
  let fixture: ComponentFixture<SuccessSignUpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessSignUpModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessSignUpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
