import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillCardListItemComponent } from './skill-card-list-item.component';

describe('SkillCardListItemComponent', () => {
  let component: SkillCardListItemComponent;
  let fixture: ComponentFixture<SkillCardListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkillCardListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillCardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
