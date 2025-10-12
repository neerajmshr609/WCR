import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatebackSelectorComponent } from './rateback-selector.component';

describe('RatebackSelectorComponent', () => {
  let component: RatebackSelectorComponent;
  let fixture: ComponentFixture<RatebackSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatebackSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatebackSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
