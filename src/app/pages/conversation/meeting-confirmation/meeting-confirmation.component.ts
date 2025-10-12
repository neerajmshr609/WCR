import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Skill } from 'src/app/shared/models/skill.model';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-meeting-confirmation',
  standalone: true,
  templateUrl: './meeting-confirmation.component.html',
  styleUrls: ['./meeting-confirmation.component.scss'],
  imports: [DatePipe, NgClass, MatIcon, MatButton, NgIf],
})
export class MeetingConfirmationComponent
  extends BaseComponent
  implements OnInit
{
  @Input() skill: Skill;
  @Input() fromCurrentUser: boolean;
  @Input() meetingTime: string;
  @Input() meetingConfirmed: boolean;
  @Input() meetingToday: boolean;
  @Input() meetingFinished: boolean;
  @Input() meetingPaid: boolean;
  @Input() meetingMissed: boolean;

  @Output() meetingConfirmEvt = new EventEmitter();

  constructor() {
    super();
  }

  public get meetingConfirmationExists(): boolean {
    return typeof this.meetingConfirmed === 'boolean';
  }

  ngOnInit() {}

  onMeetingAcceptClick() {
    this.meetingConfirmEvt.emit(true);
    this.meetingConfirmed = true;
  }

  onMeetingDeclineClick() {
    this.meetingConfirmEvt.emit(false);
  }
}
