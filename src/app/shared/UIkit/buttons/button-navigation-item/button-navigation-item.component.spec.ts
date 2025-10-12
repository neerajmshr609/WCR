import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonNavigationItemComponent } from './button-navigation-item.component';

describe('ButtonNavigationItemComponent', () => {
  let component: ButtonNavigationItemComponent;
  let fixture: ComponentFixture<ButtonNavigationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ButtonNavigationItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
