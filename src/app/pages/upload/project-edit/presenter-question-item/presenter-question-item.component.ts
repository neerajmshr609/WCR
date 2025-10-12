import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Presenterquestion } from 'src/app/shared/models/presenterquestion.model';

@Component({
  selector: 'app-presenter-question-item',
  templateUrl: './presenter-question-item.component.html',
  styleUrls: ['./presenter-question-item.component.scss'],
})
export class PresenterQuestionItemComponent implements OnInit, AfterViewInit {
  @ViewChild('inputRef') inputRef: ElementRef;

  @Input() presenterQuestion: Presenterquestion;
  @Input() length: number;

  @Output() deleteQuestion = new EventEmitter<void>();
  @Output() addQuestion = new EventEmitter<string>();

  isNewBlock = false;

  public get inputValue(): string {
    return this.inputRef?.nativeElement?.innerText;
  }

  constructor() {}

  ngOnInit(): void {
    this.isNewBlock = !!this.presenterQuestion.id;
  }

  ngAfterViewInit() {
    if (this.presenterQuestion.title) {
      this.inputRef.nativeElement.innerText = this.presenterQuestion.title;
    }
  }

  onKeyUp() {
    this.presenterQuestion.title = this.inputValue;

    // add block <p>
    if (!this.isNewBlock && this.inputValue) {
      this.addQuestion.emit();
      this.isNewBlock = true;
    }

    // If block <p> empty => finish him
    if (!this.inputValue && this.isNewBlock) {
      this.isNewBlock = false;
      this.deleteQuestion.emit();
    }
  }

  onQuestionAction() {
    this.deleteQuestion.emit();
  }
}
