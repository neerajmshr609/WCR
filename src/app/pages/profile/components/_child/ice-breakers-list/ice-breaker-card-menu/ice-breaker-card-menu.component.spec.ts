import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceBreakerCardMenuComponent } from './ice-breaker-card-menu.component';

describe('IceBreakerCardMenuComponent', () => {
  let component: IceBreakerCardMenuComponent;
  let fixture: ComponentFixture<IceBreakerCardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IceBreakerCardMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IceBreakerCardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
