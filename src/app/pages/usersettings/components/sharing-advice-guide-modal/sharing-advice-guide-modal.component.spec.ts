import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingAdviceGuideModalComponent } from './sharing-advice-guide-modal.component';

describe('SharingAdviceGuideModalComponent', () => {
  let component: SharingAdviceGuideModalComponent;
  let fixture: ComponentFixture<SharingAdviceGuideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharingAdviceGuideModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingAdviceGuideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
