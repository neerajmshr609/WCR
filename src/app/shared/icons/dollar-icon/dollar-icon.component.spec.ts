import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollarIconComponent } from './dollar-icon.component';

describe('DolarIconComponent', () => {
  let component: DollarIconComponent;
  let fixture: ComponentFixture<DollarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DollarIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DollarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
