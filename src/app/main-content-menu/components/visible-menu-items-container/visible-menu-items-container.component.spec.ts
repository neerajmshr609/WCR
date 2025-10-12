import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleMenuItemsContainerComponent } from './visible-menu-items-container.component';

describe('VisibleMenuItemsContainerComponent', () => {
  let component: VisibleMenuItemsContainerComponent;
  let fixture: ComponentFixture<VisibleMenuItemsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleMenuItemsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisibleMenuItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
