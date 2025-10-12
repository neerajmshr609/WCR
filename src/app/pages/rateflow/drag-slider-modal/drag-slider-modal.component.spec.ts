import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragSliderModalComponent } from './drag-slider-modal.component';

describe('DragSliderModalComponent', () => {
  let component: DragSliderModalComponent;
  let fixture: ComponentFixture<DragSliderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragSliderModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragSliderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
