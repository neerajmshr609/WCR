import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProposalComponent } from './login-proposal.component';

describe('LoginProposalComponent', () => {
  let component: LoginProposalComponent;
  let fixture: ComponentFixture<LoginProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginProposalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
