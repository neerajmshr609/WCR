import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentTitleComponent } from './segment-title.component';

describe('SegmentTitleComponent', () => {
  let component: SegmentTitleComponent;
  let fixture: ComponentFixture<SegmentTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
