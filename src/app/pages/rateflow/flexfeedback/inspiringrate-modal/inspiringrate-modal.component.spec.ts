import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspiringrateModalComponent } from './inspiringrate-modal.component';

describe('InspiringrateModalComponent', () => {
  let component: InspiringrateModalComponent;
  let fixture: ComponentFixture<InspiringrateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspiringrateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspiringrateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
