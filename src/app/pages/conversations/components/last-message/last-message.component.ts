import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from '../../../../shared/models/message.model';
import { MomentModule } from 'ngx-moment';
import { MentionIconComponent } from '../../../../shared/icons/mention-icon/mention-icon.component';
import { MessageIconComponent } from '../../../../shared/icons/message-icon/message-icon.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-last-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './last-message.component.html',
  imports: [MomentModule, MentionIconComponent, MessageIconComponent, NgClass],
  styleUrls: ['./last-message.component.scss'],
})
export class LastMessageComponent {
  public message = input<Message>();

  public messageCount = input<number>();
  public mentions = input<number>();
}
