import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsToolsComponent } from './skills-tools.component';

describe('SkiilsToolsComponent', () => {
  let component: SkillsToolsComponent;
  let fixture: ComponentFixture<SkillsToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillsToolsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
