import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageSpecial } from '../../../models/message.model';
import { BaseConversationMessageDirective } from '../_base-conversation-message.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-add-remove-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-add-remove-message.component.html',
  styleUrls: ['./user-add-remove-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddRemoveMessageComponent
  extends BaseConversationMessageDirective
  implements OnInit
{
  readonly message = input.required<Message>();
  public activeUserName = signal<string>(null);
  public passiveUserName = signal<string>(null);
  public messageType = signal<MessageSpecial>(null);

  ngOnInit() {
    this.messageType.set(this.message().special);
    this.detectMessageActors();
  }

  private detectMessageActors() {
    const usersData = this.message().additional_attributes?.user as {
      id: number;
      user_name: string;
      actor_user_name?: string | null;
    };
    this.activeUserName.set(usersData.actor_user_name);

    if (usersData.actor_user_name) {
      this.passiveUserName.set(usersData.user_name);
    }
  }
}
