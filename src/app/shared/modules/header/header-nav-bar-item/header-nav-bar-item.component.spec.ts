import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNavBarItemComponent } from './header-nav-bar-item.component';

describe('HeaderNavBarItemComponent', () => {
  let component: HeaderNavBarItemComponent;
  let fixture: ComponentFixture<HeaderNavBarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderNavBarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNavBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
