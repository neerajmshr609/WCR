import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLongArrowComponent } from './icon-long-arrow.component';

describe('IconLongArrowComponent', () => {
  let component: IconLongArrowComponent;
  let fixture: ComponentFixture<IconLongArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconLongArrowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconLongArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
