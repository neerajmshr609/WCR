import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ConversationState,
  ConversationStateType,
  ConversationType,
} from '../../../../shared/models/conversation.model';
import { CommunitiesIconComponent } from '../../../../shared/icons/communities-icon/communities-icon.component';
import { MessageIconComponent } from '../../../../shared/icons/message-icon/message-icon.component';
import { GetSupportIconComponent } from '../../../../shared/icons/get-support-icon/get-support-icon.component';
import { OrganizationIconComponent } from '../../../../shared/icons/organization-icon/organization-icon.component';
import { RequestIconComponent } from '../../../../shared/icons/request-icon/request-icon.component';
import { TimeIconComponent } from '../../../../shared/icons/time-icon/time-icon.component';
import { WeCareIconComponent } from '../../../../shared/icons/we-care-icon/we-care-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation-type',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-type.component.html',
  imports: [
    CommunitiesIconComponent,
    MessageIconComponent,
    GetSupportIconComponent,
    OrganizationIconComponent,
    RequestIconComponent,
    TimeIconComponent,
    WeCareIconComponent,
    TranslateModule,
    CommonModule
  ],
  styleUrls: ['./conversation-type.component.scss'],
})
export class ConversationTypeComponent {
  public type = input<ConversationType | ConversationStateType>();
  public readonly types = signal({ ...ConversationType, ...ConversationState });

  getTypeClass(type: string): string {
  switch (type) {
    case this.types().WE_CARE:
      return 'tag-we-care';
    case this.types().DIRECT_CHAT:
      return 'tag-direct-chat';
    case this.types().COMMUNITY_CHAT:
      return 'tag-community-chat';
    case this.types().GET_SUPPORT:
      return 'tag-get-support';
    case this.types().REQUESTS:
      return 'tag-requests';
    case this.types().ORG_CHAT:
      return 'tag-org-chat';
    case this.types().SCHEDULED:
      return 'tag-our-echos';
    case this.types().FEEDBACK_CHAT:
      return 'tag-feedback-chat';
    default:
      return 'tag-default';
  }
}
}
