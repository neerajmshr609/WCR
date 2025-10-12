import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { OpenRequestConversation } from '../../../../shared/models/conversation.model';

@Component({
  selector: 'app-add-to-review-queue',
  templateUrl: './add-to-review-queue.component.html',
  styleUrls: ['./add-to-review-queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToReviewQueueComponent {
  readonly openRequest = input.required<OpenRequestConversation>();
  readonly isAddedToQueue = computed(() => this.openRequest().is_in_review_queue);
}
