import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMobileNavbarItemComponent } from './header-mobile-navbar-item.component';

describe('HeaderMobileNavbarItemComponent', () => {
  let component: HeaderMobileNavbarItemComponent;
  let fixture: ComponentFixture<HeaderMobileNavbarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMobileNavbarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderMobileNavbarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
