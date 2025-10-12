import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragNDropGridItemComponent } from './drag-n-drop-grid-item.component';

describe('DragNDropGridItemComponent', () => {
  let component: DragNDropGridItemComponent;
  let fixture: ComponentFixture<DragNDropGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragNDropGridItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragNDropGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
