import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-selector',
  templateUrl: './feedback-selector.component.html',
  styleUrls: ['./feedback-selector.component.scss'],
})
export class FeedbackSelectorComponent implements OnInit {
  @Input() public selectedFeedbackType: string;
  @Input() public feedbacks;
  @Output() public selectTab = new EventEmitter<string>();

  public feedbackTypes = ['strengths', 'weaknesses', 'nextsteps', 'links'];

  constructor() {}

  ngOnInit(): void {}
}
