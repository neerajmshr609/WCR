import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonIconSaveComponent } from './button-icon-save.component';

describe('ButtonIconSaveComponent', () => {
  let component: ButtonIconSaveComponent;
  let fixture: ComponentFixture<ButtonIconSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ButtonIconSaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonIconSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
