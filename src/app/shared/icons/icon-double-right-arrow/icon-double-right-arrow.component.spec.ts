import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDoubleRightArrowComponent } from './icon-double-right-arrow.component';

describe('IconDoubleRightArrowComponent', () => {
  let component: IconDoubleRightArrowComponent;
  let fixture: ComponentFixture<IconDoubleRightArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconDoubleRightArrowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconDoubleRightArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
