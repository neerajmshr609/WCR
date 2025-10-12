import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframePreviewDialogComponent } from './iframe-preview-dialog.component';

describe('IframePreviewDialogComponent', () => {
  let component: IframePreviewDialogComponent;
  let fixture: ComponentFixture<IframePreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IframePreviewDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
