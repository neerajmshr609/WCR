import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCurrentRouteComponent } from './mobile-current-route.component';

describe('MobileCurrentRouteComponent', () => {
  let component: MobileCurrentRouteComponent;
  let fixture: ComponentFixture<MobileCurrentRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCurrentRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCurrentRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
