import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconIceBreakerComponent } from './icon-ice-breaker.component';

describe('IconIceBreakerComponent', () => {
  let component: IconIceBreakerComponent;
  let fixture: ComponentFixture<IconIceBreakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconIceBreakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconIceBreakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
