import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoErrorModalComponent } from './logo-error-modal.component';

describe('HelpInfoComponent', () => {
  let component: LogoErrorModalComponent;
  let fixture: ComponentFixture<LogoErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoErrorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
