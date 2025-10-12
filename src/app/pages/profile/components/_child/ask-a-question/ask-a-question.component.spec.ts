import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAQuestionComponent } from './ask-a-question.component';

describe('AskAQuestionComponent', () => {
  let component: AskAQuestionComponent;
  let fixture: ComponentFixture<AskAQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AskAQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskAQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
