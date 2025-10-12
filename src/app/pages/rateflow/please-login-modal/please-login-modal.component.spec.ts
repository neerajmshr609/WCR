import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleaseLoginModalComponent } from './please-login-modal.component';

describe('PleaseLoginModalComponent', () => {
  let component: PleaseLoginModalComponent;
  let fixture: ComponentFixture<PleaseLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PleaseLoginModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PleaseLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
