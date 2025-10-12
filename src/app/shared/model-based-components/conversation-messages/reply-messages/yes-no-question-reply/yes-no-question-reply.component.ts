import { Component, input, OnInit, signal } from '@angular/core';
import { Message } from '../../../../models/message.model';

@Component({
  selector: 'app-yes-no-question-reply',
  templateUrl: './yes-no-question-reply.component.html',
  styleUrls: ['./yes-no-question-reply.component.scss'],
})
export class YesNoQuestionReplyComponent implements OnInit {
  readonly initialMessage = input.required<Message>();
  readonly messageText = input.required<string>();

  public answerId = signal<number>(null);

  ngOnInit() {
    this.answerId.set(
      (
        this.initialMessage().additional_attributes as {
          answer_id: number;
          text: string;
        }[]
      ).filter((el) => el.text === this.messageText())[0].answer_id,
    );
  }

  public getOptionValue(): string {
    // TODO: Implement normal logic for translations when it is implemented on server
    if (this.messageText() === 'Yes') {
      return 'confirmation.yes';
    }
    if (this.messageText() === 'No') {
      return 'confirmation.no';
    }
  }
}
