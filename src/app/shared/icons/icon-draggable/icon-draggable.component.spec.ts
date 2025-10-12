import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDraggableComponent } from './icon-draggable.component';

describe('IconDraggableComponent', () => {
  let component: IconDraggableComponent;
  let fixture: ComponentFixture<IconDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconDraggableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
