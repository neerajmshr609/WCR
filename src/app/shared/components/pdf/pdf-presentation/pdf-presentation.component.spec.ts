import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPresentationComponent } from './pdf-presentation.component';

describe('PdfPresentationComponent', () => {
  let component: PdfPresentationComponent;
  let fixture: ComponentFixture<PdfPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfPresentationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
