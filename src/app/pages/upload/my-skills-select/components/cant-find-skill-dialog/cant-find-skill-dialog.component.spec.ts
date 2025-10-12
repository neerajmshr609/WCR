import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantFindSkillDialogComponent } from './cant-find-skill-dialog.component';

describe('CantFindSkillDialogComponent', () => {
  let component: CantFindSkillDialogComponent;
  let fixture: ComponentFixture<CantFindSkillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CantFindSkillDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CantFindSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
