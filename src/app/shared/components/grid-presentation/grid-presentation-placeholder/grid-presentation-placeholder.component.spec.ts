import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPresentationPlaceholderComponent } from './grid-presentation-placeholder.component';

describe('GridPresentationPlaceholderComponent', () => {
  let component: GridPresentationPlaceholderComponent;
  let fixture: ComponentFixture<GridPresentationPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridPresentationPlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPresentationPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
