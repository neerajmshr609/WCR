import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDeletionInstructionsComponent } from './data-deletion-instructions.component';

describe('DataDeletionInstructionsComponent', () => {
  let component: DataDeletionInstructionsComponent;
  let fixture: ComponentFixture<DataDeletionInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataDeletionInstructionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataDeletionInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
