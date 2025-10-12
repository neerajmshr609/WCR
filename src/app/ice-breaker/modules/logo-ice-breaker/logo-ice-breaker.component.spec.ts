import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoIceBreakerComponent } from './logo-ice-breaker.component';

describe('LogoIceBreakerComponent', () => {
  let component: LogoIceBreakerComponent;
  let fixture: ComponentFixture<LogoIceBreakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoIceBreakerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoIceBreakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
