import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { AudioMessage } from 'src/app/shared/models/message.model';
import { Presenterquestion } from 'src/app/shared/models/presenterquestion.model';
import { PresenterQuestionAnswer } from 'src/app/shared/models/presenter-question-answer.model';
import { User } from 'src/app/shared/models/user.model';
import { RateflowService } from 'src/app/services/rateflow.service';
import { insertString } from 'src/app/shared/functions/insert-string';

@Component({
  selector: 'app-presenter-questions-pane-item',
  templateUrl: './presenter-questions-pane-item.component.html',
  styleUrls: ['./presenter-questions-pane-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PresenterQuestionsPaneItemComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('answerRef') public answerRef: ElementRef<HTMLElement>;

  @Input() public author: User;
  @Input() public question: Presenterquestion;
  @Input() public questionHasSavedAnswer: boolean;
  @Input() public answers: PresenterQuestionAnswer[];
  @Input() public questionSavedAnswer: PresenterQuestionAnswer;
  @Input() private index: number;

  @Output() public keyDown = new EventEmitter<HTMLElement>();
  @Output() public focusOut = new EventEmitter<HTMLElement>();
  @Output() public didClickDelete = new EventEmitter<void>();

  public showWarning: boolean;
  public isRecording: boolean;
  public messageInFlight: boolean;
  public audioMessage: AudioMessage;

  public stopRecordingEvt = new EventEmitter<void>();

  constructor(private rateflowService: RateflowService) {
    super();
  }

  ngOnInit(): void {
    this.rateflowService.audioRecordingStarted$
      .pipe(
        takeUntil(this.destroyed),
        filter((res) => !!res),
        filter(
          (res) =>
            !(res.type === 'presenterquestion' && res.order === this.index),
        ),
        tap(() => this.stopRecordingEvt.emit()),
      )
      .subscribe();

    this.showWarning = +localStorage.getItem('answersCount') < 5;
  }

  public startAudioRecording() {
    this.isRecording = true;
    this.rateflowService.audioRecordingStarted = {
      order: this.index,
      tab: null,
      type: 'presenterquestion',
    };
  }

  public audioMessageUploaded(event: { url: string; duration: number }) {
    this.audioMessage = event;
    this.isRecording = false;
  }

  public deleteAudioMessage() {
    this.audioMessage = null;
    this.isRecording = false;
  }

  public didClickSend(text: string) {
    if (this.messageInFlight) {
      return;
    }
    if (!text && !this.audioMessage) {
      return;
    }

    const answer = this.answers.find(
      (obj) => obj.presenterquestion_id === this.question.id,
    );
    answer.answer = text;
    answer.audio_message = this.audioMessage;

    this.messageInFlight = true;
    this.rateflowService
      .addPresenterquestionAnswer(answer)
      .pipe(
        takeUntil(this.destroyed),
        finalize(() => (this.messageInFlight = false)),
        tap((res) => {
          answer.id = res.id;
          const count = +localStorage.getItem('answersCount') || 0;
          this.showWarning = count < 4;
          localStorage.setItem('answersCount', `${count + 1}`);
        }),
      )
      .subscribe();
  }

  public detectPaste(event: ClipboardEvent) {
    event.preventDefault();

    const data = event.clipboardData;
    const textData = data.getData('text/plain');

    if (textData) {
      insertString(textData);
    }
  }
}
