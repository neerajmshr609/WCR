import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenterQuestionsPaneItemComponent } from './presenter-questions-pane-item.component';

describe('PresenterQuestionsPaneItemComponent', () => {
  let component: PresenterQuestionsPaneItemComponent;
  let fixture: ComponentFixture<PresenterQuestionsPaneItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresenterQuestionsPaneItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenterQuestionsPaneItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
