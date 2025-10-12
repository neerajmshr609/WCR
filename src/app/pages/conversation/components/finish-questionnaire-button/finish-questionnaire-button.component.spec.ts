import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishQuestionnaireButtonComponent } from './finish-questionnaire-button.component';

describe('FinishQuestionnaireButtonComponent', () => {
  let component: FinishQuestionnaireButtonComponent;
  let fixture: ComponentFixture<FinishQuestionnaireButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinishQuestionnaireButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinishQuestionnaireButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
