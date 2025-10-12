import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativesWarningModalComponent } from './creatives-warning-modal.component';

describe('CreativesWarningModalComponent', () => {
  let component: CreativesWarningModalComponent;
  let fixture: ComponentFixture<CreativesWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreativesWarningModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativesWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
