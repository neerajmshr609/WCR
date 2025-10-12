import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ANON_USER_ID } from 'src/config/config';
import { PresenterQuestionAnswer } from 'src/app/shared/models/presenter-question-answer.model';
import { Project } from 'src/app/shared/models/project.model';
import { RateflowService } from 'src/app/services/rateflow.service';

@Component({
  selector: 'app-presenter-questions-pane',
  templateUrl: './presenter-questions-pane.component.html',
  styleUrls: ['./presenter-questions-pane.component.scss'],
})
export class PresenterQuestionsPaneComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() public project: Project;
  @Input() public author: User;
  @Input() public currentUser: User;

  messageInFlight = false;
  answers: PresenterQuestionAnswer[] = [];

  constructor(
    private rateflowService: RateflowService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  fetchAnswers() {
    this.rateflowService
      .fetchPresenterquestionAnswersForProjectAndUser(
        this.project.id,
        this.currentUser.id,
      )
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        const updatedArr: PresenterQuestionAnswer[] = [];

        this.answers.forEach((answ) => {
          const savedAnswer = res.find(
            (obj) => obj.presenterquestion_id === answ.presenterquestion_id,
          );
          updatedArr.push(savedAnswer || answ);
        });

        this.answers = [...updatedArr];
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentUser.currentValue) {
      this.setupQuestionsForUserID();
    }
  }

  setupQuestionsForUserID() {
    this.answers = [];

    this.project.presenterquestions.forEach((question) => {
      const answer = new PresenterQuestionAnswer(
        null,
        question.id,
        this.currentUser?.id || ANON_USER_ID,
      );
      this.answers.push(answer);
    });

    if (this.currentUser) {
      this.fetchAnswers();
    }
  }

  questionSavedAnswer(presenterQuestionID: number): PresenterQuestionAnswer {
    const answer = this.answers.find(
      (obj) => obj.presenterquestion_id === presenterQuestionID,
    );

    if (answer?.id) {
      return answer;
    }
  }

  questionHasSavedAnswer(presenterQuestionID: number): boolean {
    const answer = this.answers.find(
      (obj) => obj.presenterquestion_id === presenterQuestionID,
    );
    return !!(answer && answer.id);
  }

  didClickDelete(questionID: number) {
    const index = this.answers.findIndex(
      (obj) => obj.presenterquestion_id === questionID,
    );

    this.rateflowService
      .deletePresenterquestionAnswer(this.answers[index])
      .pipe(
        takeUntil(this.destroyed),
        tap(
          () =>
            (this.answers[index] = new PresenterQuestionAnswer(
              null,
              questionID,
              this.currentUser?.id || ANON_USER_ID,
            )),
        ),
      )
      .subscribe();
  }

  onKeyDown(input: HTMLElement) {
    this.renderer.setStyle(input, 'color', '#000000');
  }

  onFocusOut(input: HTMLElement) {
    if (!input.innerText) {
      this.renderer.setStyle(input, 'color', '#B0B0B0');
    }
  }
}
