import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseIconComponent } from './case-icon.component';

describe('CaseIconComponent', () => {
  let component: CaseIconComponent;
  let fixture: ComponentFixture<CaseIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
