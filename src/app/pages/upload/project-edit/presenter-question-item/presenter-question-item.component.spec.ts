import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresenterQuestionItemComponent } from './presenter-question-item.component';

describe('PresenterQuestionItemComponent', () => {
  let component: PresenterQuestionItemComponent;
  let fixture: ComponentFixture<PresenterQuestionItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PresenterQuestionItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenterQuestionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
