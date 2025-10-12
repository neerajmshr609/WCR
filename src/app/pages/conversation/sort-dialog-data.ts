import { Conversation } from '../../shared/models/conversation.model';
import { Lesson } from '../../shared/models/lesson.model';
import { PaymentSession } from '../../shared/models/payment-session';
import { Message } from '../../shared/models/message.model';
import { DialogData } from './dialog-data';

export const SortDialogData = (
  conversation: Conversation,
  iceBreakerLessonForFeedback: Lesson | undefined,
): DialogData[] => {
  return (
    conversation.messages
      ?.map((data) => ({ type: 'message', data }))
      .concat(conversation.lessons?.map((data) => ({ type: 'lesson', data })))
      .concat(
        conversation.message_payment_sessions.map((data) => ({
          type: 'paymentSession',
          data,
        })),
      )
      // for IceBreaker feedback purpose
      .concat(
        iceBreakerLessonForFeedback
          ? [
              {
                type: 'iceBreaker-lesson',
                data: iceBreakerLessonForFeedback,
              },
            ]
          : [],
      )
      .sort((a, b) => {
        const dateA = getSortDate(a);
        const dateB = getSortDate(b);
        return dateA - dateB;
      })
  );
};

function getSortDate(data: DialogData): number {
  let date = new Date();

  switch (data.type) {
    case 'paymentSession':
      date = new Date((data.data as PaymentSession).last_message_date);
      break;

    case 'message':
      date = new Date((data.data as Message).created_at);
      break;

    case 'lesson':
      date = new Date((data.data as Lesson).created_at);
      break;

    case 'iceBreaker-lesson':
      date = new Date((data.data as Lesson).created_at);
      break;

    default:
      break;
  }

  return date.getTime();
}
