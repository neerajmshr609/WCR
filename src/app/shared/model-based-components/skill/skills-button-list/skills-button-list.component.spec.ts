import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsButtonListComponent } from './skills-button-list.component';

describe('SkillsButtonListComponent', () => {
  let component: SkillsButtonListComponent;
  let fixture: ComponentFixture<SkillsButtonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SkillsButtonListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsButtonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
