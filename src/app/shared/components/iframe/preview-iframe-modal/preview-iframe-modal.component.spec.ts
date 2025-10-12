import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewIframeModalComponent } from './preview-iframe-modal.component';

describe('PreviewIframeModalComponent', () => {
  let component: PreviewIframeModalComponent;
  let fixture: ComponentFixture<PreviewIframeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewIframeModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewIframeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
