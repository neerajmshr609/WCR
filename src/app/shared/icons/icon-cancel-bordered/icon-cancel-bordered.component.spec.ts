import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCancelBorderedComponent } from './icon-cancel-bordered.component';

describe('IconCancelBorderedComponent', () => {
  let component: IconCancelBorderedComponent;
  let fixture: ComponentFixture<IconCancelBorderedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCancelBorderedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconCancelBorderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
