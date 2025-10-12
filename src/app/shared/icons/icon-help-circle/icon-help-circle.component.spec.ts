import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHelpCircleComponent } from './icon-help-circle.component';

describe('IconHelpCircleComponent', () => {
  let component: IconHelpCircleComponent;
  let fixture: ComponentFixture<IconHelpCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconHelpCircleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHelpCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
