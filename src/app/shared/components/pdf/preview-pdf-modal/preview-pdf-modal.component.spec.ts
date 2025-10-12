import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPdfModalComponent } from './preview-pdf-modal.component';

describe('PreviewPdfModalComponent', () => {
  let component: PreviewPdfModalComponent;
  let fixture: ComponentFixture<PreviewPdfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewPdfModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPdfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
