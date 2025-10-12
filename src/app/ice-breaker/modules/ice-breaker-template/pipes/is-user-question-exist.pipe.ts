import { Pipe, PipeTransform } from '@angular/core';
import { IceBreakerTemplateMessage } from '../ice-breaker-template-messages';

@Pipe({
  name: 'isUserQuestionExist',
})
export class IsUserQuestionExistPipe implements PipeTransform {
  transform(messages: IceBreakerTemplateMessage[]): boolean {
    return messages.some(
      (message: IceBreakerTemplateMessage) => message.isQuestion,
    );
  }
}
