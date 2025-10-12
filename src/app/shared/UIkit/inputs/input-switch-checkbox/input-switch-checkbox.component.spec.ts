import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSwitchCheckboxComponent } from './input-switch-checkbox.component';

describe('InputSwitchCheckboxComponent', () => {
  let component: InputSwitchCheckboxComponent;
  let fixture: ComponentFixture<InputSwitchCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InputSwitchCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSwitchCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
