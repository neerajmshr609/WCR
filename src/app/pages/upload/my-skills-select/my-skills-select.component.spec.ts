import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MySkillsSelectComponent } from './my-skills-select.component';

describe('MySkillsSelectComponent', () => {
  let component: MySkillsSelectComponent;
  let fixture: ComponentFixture<MySkillsSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MySkillsSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySkillsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
