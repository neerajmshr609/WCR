import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GridPresentationComponent } from './grid-presentation.component';

describe('GridPresentationComponent', () => {
  let component: GridPresentationComponent;
  let fixture: ComponentFixture<GridPresentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GridPresentationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
