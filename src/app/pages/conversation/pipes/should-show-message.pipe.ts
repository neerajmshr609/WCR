import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../../../shared/models/message.model';
import { User } from '../../../shared/models/user.model';
import { isUrlString } from '../../../shared/functions/is-url-string';

@Pipe({
  name: 'shouldShowMessage',
  standalone: true,
})
export class ShouldShowMessagePipe implements PipeTransform {
  transform(message: Message, currentUser: User): boolean {
    return shouldShowMessage(message, currentUser);
  }
}

export function shouldShowMessage(
  message: Message,
  currentUser: User,
): boolean {
  const isIceBreakerMessageFromConnector =
    message.system_message && message.user.id === currentUser.id;
  const isIceBreakerTitleMessage =
    isIceBreakerMessageFromConnector && isUrlString(message.body);
  if (isIceBreakerTitleMessage) {
    return true;
  } else if (isIceBreakerMessageFromConnector && !isIceBreakerTitleMessage) {
    return false;
  }
  return true;
}
