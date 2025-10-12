import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { NewsfeedFeedback } from '../../models/newsfeedfeedback.model';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-feedback-bubble',
  templateUrl: './feedback-bubble.component.html',
  styleUrls: ['./feedback-bubble.component.scss'],
})
export class FeedbackBubbleComponent extends BaseComponent implements OnInit {
  @Input() public feedback: NewsfeedFeedback;
  @Input() public rater: User;
  @Input() public isSelected: boolean;
  @Input() public isAuthor: boolean;
  @Input() public canSelectLanguage: boolean;
  @Input() public project: Project;

  // for newsfeed-item
  @Input() public isGameCard: boolean;
  @Input() public hideTag: boolean;

  // for project-card-v2
  @Input() public isProjectCard: boolean;
  @Input() public showScreenshot: boolean;
  @Input() public showCurves: boolean;

  @Output() public selectFeedback = new EventEmitter<Event>();
  @Output() public didSelectRerateRateback = new EventEmitter<number>();

  public borderColor: string;

  constructor(private newsfeedService: NewsfeedService) {
    super();
  }

  ngOnInit(): void {
    const colors = {
      blue: '#00AFFE',
      mustard: '#E3BE30',
      green: '#00C67E',
    };
    this.borderColor = colors[this.feedback?.avratingparam?.color];
  }

  public getRatebackName(rateback: number): string[] {
    if (rateback === 5) {
      return ['inspiring', 'Brilliant insight'];
    }
    if (rateback === 1) {
      return ['helpful', 'Helpful'];
    }
    if (rateback === -1) {
      return ['unhelpful', 'Not helpful'];
    }
    if (rateback === -5) {
      return ['discouraging', 'Disrespectful'];
    }
  }

  public onAudioMsgLangChange(language: string): void {
    this.feedback.audio_message.language = language;

    this.newsfeedService
      .updateFeedbackLang(this.feedback.id, {
        audio_message: this.feedback.audio_message,
      })
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }
}
