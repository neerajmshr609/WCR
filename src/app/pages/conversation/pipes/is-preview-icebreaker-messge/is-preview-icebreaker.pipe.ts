import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Message } from '../../../../shared/models/message.model';
import { isUrlString } from '../../../../shared/functions/is-url-string';

@Pipe({
  name: 'isPreviewIcebreaker',
})
export class IsPreviewIcebreakerPipe implements PipeTransform {
  transform(message: Message, currentUser: User): boolean {
    return (
      message.system_message &&
      isUrlString(message.body) &&
      currentUser.id === message.user_id
    );
  }
}
