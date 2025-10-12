import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonIconEditComponent } from './button-icon-edit.component';

describe('ButtonIconEditComponent', () => {
  let component: ButtonIconEditComponent;
  let fixture: ComponentFixture<ButtonIconEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonIconEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonIconEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
