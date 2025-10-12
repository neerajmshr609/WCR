import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  ConversationStateType,
  ConversationType,
} from '../../../../shared/models/conversation.model';
import { TranslateModule } from '@ngx-translate/core';
import { ResizeService } from '../../../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';

type EmptyView = Record<
  ConversationType | ConversationStateType,
  { image: string; title: string; subtitle: string }
>;

@Component({
  selector: 'app-empty-conversations',
  templateUrl: './empty-conversations.component.html',
  styleUrls: ['./empty-conversations.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class EmptyConversationsComponent {
  public isDesktop = toSignal(this.resizeService.isDesktop$);
  public filteredTypes = input<(ConversationType | ConversationStateType)[]>(
    [],
  );

  public readonly views: Partial<EmptyView> = {
    requests: {
      title: 'empty.request-title',
      subtitle: 'empty.request-subtitle',
      image: 'assets/conversations/empty/open-request.svg',
    },
    we_care: {
      title: 'empty.we-care-title',
      subtitle: 'empty.we-care-subtitle',
      image: 'assets/conversations/empty/we-care.svg',
    },
    scheduled: {
      title: 'empty.scheduled-title',
      subtitle: 'empty.scheduled-subtitle',
      image: 'assets/conversations/empty/scheduled.svg',
    },
    get_support: {
      title: 'empty.support-title',
      subtitle: 'empty.support-subtitle',
      image: 'assets/conversations/empty/get-support.svg',
    },
    community_chat: {
      title: 'empty.com-title',
      subtitle: 'empty.com-subtitle',
      image: 'assets/conversations/empty/communities.svg',
    },
    org_chat: {
      title: 'empty.org-title',
      subtitle: 'empty.org-subtitle',
      image: 'assets/conversations/empty/org-chat.svg',
    },
    direct_chat: {
      title: 'empty.direct-title',
      subtitle: 'empty.direct-subtitle',
      image: 'assets/conversations/empty/direct-message.svg',
    },
  };

  constructor(private resizeService: ResizeService) {}
}
