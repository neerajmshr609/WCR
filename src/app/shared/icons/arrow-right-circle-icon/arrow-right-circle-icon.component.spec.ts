import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowRightCircleIconComponent } from './arrow-right-circle-icon.component';

describe('DolarIconComponent', () => {
  let component: ArrowRightCircleIconComponent;
  let fixture: ComponentFixture<ArrowRightCircleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowRightCircleIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrowRightCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
