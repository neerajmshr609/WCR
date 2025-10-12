import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsToolsIconComponent } from './skills-tools-icon.component';

describe('SkillsToolsIconComponent', () => {
  let component: SkillsToolsIconComponent;
  let fixture: ComponentFixture<SkillsToolsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillsToolsIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsToolsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
