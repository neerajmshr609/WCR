import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarShrinkComponent } from './sidebar-shrink.component';

describe('SidebarShrinkComponent', () => {
  let component: SidebarShrinkComponent;
  let fixture: ComponentFixture<SidebarShrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarShrinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarShrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
