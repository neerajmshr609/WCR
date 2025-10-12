import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBtnIconComponent } from './upload-btn-icon.component';

describe('UploadBtnIconComponent', () => {
  let component: UploadBtnIconComponent;
  let fixture: ComponentFixture<UploadBtnIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadBtnIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBtnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
