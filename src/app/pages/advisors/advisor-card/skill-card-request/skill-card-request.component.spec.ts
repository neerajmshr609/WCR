import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillCardRequestComponent } from './skill-card-request.component';

describe('SkillCardRequestComponent', () => {
  let component: SkillCardRequestComponent;
  let fixture: ComponentFixture<SkillCardRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkillCardRequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillCardRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
