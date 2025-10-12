import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, of, Subject } from 'rxjs';
import {
  finishAddNewQuestions,
  IceBreakerTemplateMessage,
  setNewTitleMessage,
  StepQuestionTemplate,
} from '../ice-breaker-template-messages';
import { generateId } from '../generate-id';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { IceBreakerService } from 'src/app/ice-breaker/service/ice-breaker.service';
import { User } from 'src/app/shared/models/user.model';

@Injectable()
export class EditIceBreakerService implements OnDestroy {
  private currentUser: User;
  private readonly messagesStore: BehaviorSubject<IceBreakerTemplateMessage[]> =
    new BehaviorSubject<IceBreakerTemplateMessage[]>([]);
  private readonly isCanFinishChanges: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly destroy$ = new Subject<unknown>();
  private isCreateNewQuestion = false;
  readonly isSetPrice = new BehaviorSubject<boolean>(false);
  readonly isSetTitle = new BehaviorSubject<boolean>(false);
  readonly isCompleteIceBreaker = new BehaviorSubject<{ id: number }>(null);
  readonly savedUserQuestions = new BehaviorSubject<
    IceBreakerTemplateMessage[][]
  >([]);
  private readonly questionToSetOriginalTitle = new BehaviorSubject<boolean>(
    false,
  );
  private readonly iceBreakerPrice: BehaviorSubject<number> =
    new BehaviorSubject<number>(undefined);
  private icebreakerId: number;
  questionToSetOriginalTitle$ = this.questionToSetOriginalTitle.asObservable();
  messages$ = this.messagesStore.asObservable();
  isCanFinishChanges$ = this.isCanFinishChanges.asObservable();

  constructor(
    private readonly icebreakerService: IceBreakerService,
    private readonly authService: AuthService,
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {
    this.authService.userSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  isNewQuestionsState(
    isNewQuestions: boolean = false,
    icebreakerMemberId: number,
    title: string,
  ): void {
    if (isNewQuestions) {
      this.isCreateNewQuestion = true;
      this.icebreakerId = icebreakerMemberId;
      return;
    }
    this.isCreateNewQuestion = false;
  }

  saveUserQuestions(questions: IceBreakerTemplateMessage[]): void {
    this.savedUserQuestions.next([
      ...this.savedUserQuestions.value,
      questions.map((question) => ({ ...question, isQuestion: true })),
    ]);
  }

  sendMessage(message: IceBreakerTemplateMessage): void {
    this.addNewMessageToStore({ ...message, isOwner: true });
  }

  private addNewMessageToStore(newMessage: IceBreakerTemplateMessage): void {
    this.messagesStore.next([
      ...this.messagesStore.value,
      {
        ...newMessage,
        id: generateId(),
        isOwner: true,
        isTitle: this.isSetTitle.value,
      },
    ]);
    const countOfMessagesInTheStore = this.messagesStore.value.length;
    if (countOfMessagesInTheStore > 0 && !this.isCreateNewQuestion) {
      this.isCanFinishChanges.next(true);
      return;
    }
    if (this.isSetTitle.value) {
      this.keepOriginalTitle(false);
    }
  }

  finishChanges(
    initialStep: StepQuestionTemplate,
    questionToEdit: IceBreakerTemplateMessage,
    icebreaker_member_id: number,
  ): void {
    const indexOfEditMessage: number = initialStep.questions.findIndex(
      (q: IceBreakerTemplateMessage) => q.id === questionToEdit.id,
    );
    const updatedQuestions = this.messagesStore.value.map(
      (question: IceBreakerTemplateMessage) => {
        const { id, isOwner, isQuestion, isTitle, isRichMedia, ...rest } =
          question;
        return {
          id,
          body: {
            ...rest,
            audio_message: question.audio_message || null,
            user_id: this.currentUser.id,
          },
        };
      },
    );
    // @ts-ignore
    const modifiedQuestions: IceBreakerTemplateMessage[] = [
      ...initialStep.questions.slice(0, indexOfEditMessage),
      ...updatedQuestions,
      ...initialStep.questions.slice(indexOfEditMessage + 1),
    ];
    initialStep.questions = modifiedQuestions;
    // some http call
    this.icebreakerService
      .updateIceBreaker({
        icebreaker_member_id,
        step_id: initialStep.id,
        icebreaker_id: icebreaker_member_id,
        questions: initialStep.questions,
      })
      .pipe(
        tap(() => this.matDialog.closeAll()),
        catchError(() => {
          this.snackBar.open('Something went wrong!');
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setPriceState(state: boolean): void {
    this.isSetPrice.next(state);
  }

  wantToKeepOriginalTitleQuestion(): void {
    this.setPriceState(false);
    this.questionToSetOriginalTitle.next(true);
  }

  wantToSetNewTitle(): void {
    this.setPriceState(false);
    this.questionToSetOriginalTitle.next(false);
    of('')
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.messagesStore.next([
          ...this.messagesStore.value,
          { id: generateId(), ...setNewTitleMessage },
        ]);
      });
    this.isSetTitle.next(true);
    this.isSetPrice.next(false);
  }

  keepOriginalTitle(state: boolean = true): void {
    this.isSetTitle.next(true);
    this.isSetPrice.next(false);
    this.questionToSetOriginalTitle.next(false);
    // api call
    this.messagesStore.next([
      ...this.messagesStore.value,
      { id: generateId(), ...finishAddNewQuestions },
    ]);
    const request = this.savedUserQuestions.value.map(
      (m: IceBreakerTemplateMessage[]) => {
        // @ts-ignore
        const stepOfQuestions: IceBreakerTemplateMessage[] = m
          .filter((messages: IceBreakerTemplateMessage) => messages.isQuestion)
          .map((messages: IceBreakerTemplateMessage) => {
            delete messages.isQuestion;
            return {
              id: generateId(),
              body: {
                ...messages,
                user_id: this.currentUser.id,
              },
            };
          });
        return {
          id: generateId(),
          questions: stepOfQuestions,
        };
      },
    );
    const partialUpdate = {
      title: this.messagesStore.value.find(
        (message: IceBreakerTemplateMessage) => message?.isTitle,
      )?.body,
      price: this.iceBreakerPrice.value,
    };
    this.icebreakerService
      .addNewQuestionsToIceBreaker({
        icebreaker_member_id: this.icebreakerId,
        new: true,
        icebreaker_id: this.icebreakerId,
        questions: request,
      })
      .pipe(
        switchMap(() => {
          if (partialUpdate.title || typeof partialUpdate.price === 'number') {
            return this.icebreakerService.updateTitlePrice(
              this.icebreakerId,
              partialUpdate,
            );
          }
          return EMPTY;
        }),
        tap(() => {
          this.isCompleteIceBreaker.next({ id: this.icebreakerId });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setPrice(price: number) {
    this.iceBreakerPrice.next(price);
  }

  nextQuestion(): void {
    this.isSetPrice.next(false);
    this.isSetTitle.next(false);
    this.isCompleteIceBreaker.next(null);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
