import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ISummaryOpenRequest } from './summary.interface';
import { RequestType } from '../../../../shared/models/conversation.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  readonly openRequestConversation = input.required<ISummaryOpenRequest>();
  readonly summary = computed(() => this.openRequestConversation().summary);
  readonly answeredQuestions = computed(() => {
    if (!this.summary()) {
      return;
    }
    const { questions_complete, questions_count } = this.summary();
    return `${questions_complete} of ${questions_count}`;
  });
  protected readonly RequestType = RequestType;
}
