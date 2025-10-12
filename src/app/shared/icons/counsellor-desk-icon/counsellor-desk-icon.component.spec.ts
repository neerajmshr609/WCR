import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorDeskIconComponent } from './counsellor-desk-icon.component';

describe('CounsellorDeskIconComponent', () => {
  let component: CounsellorDeskIconComponent;
  let fixture: ComponentFixture<CounsellorDeskIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounsellorDeskIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounsellorDeskIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
