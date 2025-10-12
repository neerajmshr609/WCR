import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconShakeHandsSmallComponent } from './icon-shake-hands-small.component';

describe('IconShakeHandsSmallComponent', () => {
  let component: IconShakeHandsSmallComponent;
  let fixture: ComponentFixture<IconShakeHandsSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconShakeHandsSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconShakeHandsSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
