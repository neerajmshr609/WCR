import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunflawerIconComponent } from './sunflawer-icon.component';

describe('SunflawerIconComponent', () => {
  let component: SunflawerIconComponent;
  let fixture: ComponentFixture<SunflawerIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunflawerIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SunflawerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
