import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoQuestionReplyComponent } from './yes-no-question-reply.component';

describe('YesNoQuestionReplyComponent', () => {
  let component: YesNoQuestionReplyComponent;
  let fixture: ComponentFixture<YesNoQuestionReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YesNoQuestionReplyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoQuestionReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
