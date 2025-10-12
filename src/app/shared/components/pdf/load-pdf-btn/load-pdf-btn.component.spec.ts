import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPdfBtnComponent } from './load-pdf-btn.component';

describe('LoadPdfBtnComponent', () => {
  let component: LoadPdfBtnComponent;
  let fixture: ComponentFixture<LoadPdfBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadPdfBtnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPdfBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
