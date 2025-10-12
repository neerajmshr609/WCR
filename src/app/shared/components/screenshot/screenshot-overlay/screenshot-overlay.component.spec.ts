import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotOverlayComponent } from './screenshot-overlay.component';

describe('ScreenshotOverlayComponent', () => {
  let component: ScreenshotOverlayComponent;
  let fixture: ComponentFixture<ScreenshotOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenshotOverlayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenshotOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
