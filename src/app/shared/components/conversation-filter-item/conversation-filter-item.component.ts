import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CalendarIconComponent } from '../../icons/calendar-icon/calendar-icon.component';
import { MentionIconComponent } from '../../icons/mention-icon/mention-icon.component';
import { MessageIconComponent } from '../../icons/message-icon/message-icon.component';

@Component({
  selector: 'app-conversation-filter-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-filter-item.component.html',
  imports: [CalendarIconComponent, MentionIconComponent, MessageIconComponent],
  styleUrls: ['./conversation-filter-item.component.scss'],
})
export class ConversationFilterItemComponent {
  public mentions = input<null | number>(null);
  public messages = input<null | number>(null);
  public scheduled = input<null | number>(null);
}
