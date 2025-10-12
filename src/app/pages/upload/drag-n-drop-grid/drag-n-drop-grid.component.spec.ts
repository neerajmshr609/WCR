import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DragNDropGridComponent } from './drag-n-drop-grid.component';

describe('DragNDropGridComponent', () => {
  let component: DragNDropGridComponent;
  let fixture: ComponentFixture<DragNDropGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DragNDropGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragNDropGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
