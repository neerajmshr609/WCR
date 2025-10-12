import { Component, computed, input, signal } from '@angular/core';
import { QueuedConversationImage } from '../../../../shared/model-based-components/conversation-image/conversation-image.interface';
import { OpenRequestConversation } from '../../../../shared/models/conversation.model';
import { getPseudoRandomImg } from '../../../../shared/functions/get-pseudo-random-img';
import { defaultOrgAvatars } from '../../../../shared/const/default-org-images';

@Component({
  selector: 'app-queued-by',
  templateUrl: './queued-by.component.html',
  styleUrls: ['./queued-by.component.scss'],
})
export class QueuedByComponent {
  readonly openRequestConversation = input.required<OpenRequestConversation>();

  readonly queuedByImages = computed(() =>
    this.openRequestConversation().queued_by.map((queuedBy, i) => {
      const conversationImages = [] as QueuedConversationImage[];
      if (queuedBy.organization_id) {
        conversationImages.push({
          type: 'org',
          src: queuedBy.organization_image
            ? queuedBy.organization_image
            : getPseudoRandomImg(queuedBy.organization_id, defaultOrgAvatars),
          alt: `Organization avatar`,
        });
      }
      conversationImages.push({
        type: 'user',
        src: queuedBy.user_image ? queuedBy.user_image : undefined,
        alt: `Organization avatar`,
      });
      return conversationImages;
    }),
  );
}
