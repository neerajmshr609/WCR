import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerIconComponent } from './scanner-icon.component';

describe('ScanerIconComponent', () => {
  let component: ScannerIconComponent;
  let fixture: ComponentFixture<ScannerIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
