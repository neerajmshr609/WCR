import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimIconComponent } from './aim-icon.component';

describe('AimIconComponent', () => {
  let component: AimIconComponent;
  let fixture: ComponentFixture<AimIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AimIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AimIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
