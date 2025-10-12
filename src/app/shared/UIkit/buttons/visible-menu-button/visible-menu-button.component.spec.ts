import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleMenuButtonComponent } from './visible-menu-button.component';

describe('MenuButtonComponent', () => {
  let component: VisibleMenuButtonComponent;
  let fixture: ComponentFixture<VisibleMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisibleMenuButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisibleMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
