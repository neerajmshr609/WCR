import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoIconComponent } from './account-info-icon.component';

describe('AccountInfoIconComponent', () => {
  let component: AccountInfoIconComponent;
  let fixture: ComponentFixture<AccountInfoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountInfoIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountInfoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
