import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Renderer2,
} from '@angular/core';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ConversationsService } from 'src/app/services/conversations.service';

@Component({
  selector: 'app-meeting-feedback',
  templateUrl: './meeting-feedback.component.html',
  styleUrls: ['./meeting-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingFeedbackComponent implements OnInit {
  @Input() lesson: Lesson;

  meetingFeedbackSubmiting: boolean;
  meetingFeedbackOptions = [
    {
      id: 1,
      question: 'How well did you understand this Connector?',
      key: 'pronunciation_rate',
    },
    {
      id: 2,
      question: 'How well did this Connector understand the topic?',
      key: 'knowledge_rate',
    },
    {
      id: 3,
      question:
        'How would you rate your GetMe interaction with this Connector?',
      key: 'explanation_rate',
    },
    {
      id: 4,
      question:
        'How polite, patient and responsive did you find this Connector?',
      key: 'politeness_rate',
    },
  ];

  constructor(
    private conversationsService: ConversationsService,
    private renderer: Renderer2,
  ) {}

  didUpdateSlider(slider: string, value: number) {
    this.lesson[slider] = value;
  }

  onSendFeedbackClick() {
    this.lesson.rated = true;
    this.meetingFeedbackSubmiting = true;
    this.conversationsService.updateLesson(this.lesson).subscribe((res) => {
      this.meetingFeedbackSubmiting = false;
    });
  }

  didClickSend(input: HTMLElement, commentType: string) {
    this.lesson[commentType] = input.innerText;
  }

  onKeyDown(input: HTMLElement) {
    if (input.innerText === 'Type your answer...') {
      input.innerText = '';
    }

    this.renderer.setStyle(input, 'color', '#000000');
  }

  onFocusOut(input: HTMLElement) {
    if (input.innerText.length === 0) {
      this.renderer.setStyle(input, 'color', '#B0B0B0');
      input.innerText = 'Type your answer...';
    }
  }

  onFocus(input: HTMLElement) {
    if (input.innerText === 'Type your answer...') {
      input.innerText = '';
    }
  }

  ngOnInit(): void {}
}
