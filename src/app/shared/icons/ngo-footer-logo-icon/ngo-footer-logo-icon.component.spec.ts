import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgoLogoIconComponent } from './ngo-footer-logo-icon.component';

describe('LogoIconComponent', () => {
  let component: NgoLogoIconComponent;
  let fixture: ComponentFixture<NgoLogoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgoLogoIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgoLogoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
