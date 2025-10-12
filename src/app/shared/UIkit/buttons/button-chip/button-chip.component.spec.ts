import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonChipComponent } from './button-chip.component';

describe('ButtonChipComponent', () => {
  let component: ButtonChipComponent;
  let fixture: ComponentFixture<ButtonChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ButtonChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
