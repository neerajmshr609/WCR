import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideConnectedComponent } from './slide-connected.component';

describe('SlideConnectedComponent', () => {
  let component: SlideConnectedComponent;
  let fixture: ComponentFixture<SlideConnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlideConnectedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
