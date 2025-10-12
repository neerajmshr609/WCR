import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresenterQuestionsPaneComponent } from './presenter-questions-pane.component';

describe('PresenterQuestionsPaneComponent', () => {
  let component: PresenterQuestionsPaneComponent;
  let fixture: ComponentFixture<PresenterQuestionsPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PresenterQuestionsPaneComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenterQuestionsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
