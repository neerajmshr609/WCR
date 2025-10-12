import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeCareIconComponent } from './we-care-icon.component';

describe('WeCareIconComponent', () => {
  let component: WeCareIconComponent;
  let fixture: ComponentFixture<WeCareIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeCareIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeCareIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
