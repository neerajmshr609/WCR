import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelfContactErrorModalComponent } from './self-contact-error-modal.component';

describe('SelfContactErrorModalComponent', () => {
  let component: SelfContactErrorModalComponent;
  let fixture: ComponentFixture<SelfContactErrorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelfContactErrorModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfContactErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
