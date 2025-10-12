import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotFullViewComponent } from './screenshot-full-view.component';

describe('ScreenshotFullViewComponent', () => {
  let component: ScreenshotFullViewComponent;
  let fixture: ComponentFixture<ScreenshotFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenshotFullViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenshotFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
