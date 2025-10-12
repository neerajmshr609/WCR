import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ask-a-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ask-a-question.component.html',
  styleUrls: ['./ask-a-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AskAQuestionComponent {

}
