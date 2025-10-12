import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragHandleIconComponent } from './drag-handle-icon.component';

describe('DragHandleIconComponent', () => {
  let component: DragHandleIconComponent;
  let fixture: ComponentFixture<DragHandleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragHandleIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragHandleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
