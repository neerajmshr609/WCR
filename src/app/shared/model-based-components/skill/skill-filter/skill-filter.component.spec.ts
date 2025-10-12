import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillFilterComponent } from './skill-filter.component';

describe('GetHelpFilterComponent', () => {
  let component: SkillFilterComponent;
  let fixture: ComponentFixture<SkillFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
