import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightArrowIconComponent } from './right-arrow-icon.component';

describe('RightArrowIconComponent', () => {
  let component: RightArrowIconComponent;
  let fixture: ComponentFixture<RightArrowIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RightArrowIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RightArrowIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
