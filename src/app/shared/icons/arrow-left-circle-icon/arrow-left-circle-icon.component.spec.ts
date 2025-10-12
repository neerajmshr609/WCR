import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowLeftCircleIconComponent } from './arrow-left-circle-icon.component';

describe('DolarIconComponent', () => {
  let component: ArrowLeftCircleIconComponent;
  let fixture: ComponentFixture<ArrowLeftCircleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowLeftCircleIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrowLeftCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
