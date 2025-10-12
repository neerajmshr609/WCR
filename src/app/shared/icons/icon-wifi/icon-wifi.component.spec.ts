import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconWifiComponent } from './icon-wifi.component';

describe('IconWifiComponent', () => {
  let component: IconWifiComponent;
  let fixture: ComponentFixture<IconWifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconWifiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
