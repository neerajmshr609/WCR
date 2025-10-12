import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconShakeHandsComponent } from './icon-shake-hands.component';

describe('IconShakeHandsComponent', () => {
  let component: IconShakeHandsComponent;
  let fixture: ComponentFixture<IconShakeHandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconShakeHandsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconShakeHandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
