import { Directive, input } from '@angular/core';
import { Message } from '../../models/message.model';

@Directive({
  selector: '[appBaseConversationMessage]',
  standalone: true,
})
export class BaseConversationMessageDirective {
  readonly message = input.required<Message>();
}
