import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedWithoutSkillErrorModalComponent } from './selected-without-skill-error-modal.component';

describe('SelectedWithoutSkillErrorModalComponent', () => {
  let component: SelectedWithoutSkillErrorModalComponent;
  let fixture: ComponentFixture<SelectedWithoutSkillErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedWithoutSkillErrorModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedWithoutSkillErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
