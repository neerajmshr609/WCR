import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceBreakerCardComponent } from './ice-breaker-card.component';

describe('IceBreakerCardComponent', () => {
  let component: IceBreakerCardComponent;
  let fixture: ComponentFixture<IceBreakerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IceBreakerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IceBreakerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
