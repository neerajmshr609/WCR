import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconWifiOffComponent } from './icon-wifi-off.component';

describe('IconWifiOffComponent', () => {
  let component: IconWifiOffComponent;
  let fixture: ComponentFixture<IconWifiOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconWifiOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconWifiOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
