import { Message } from '../../shared/models/message.model';
import { Lesson } from '../../shared/models/lesson.model';
import { PaymentSession } from '../../shared/models/payment-session';

export interface DialogData {
  type: string | 'lesson' | 'message' | 'paymentSession' | 'iceBreaker-lesson';
  data: Message | Lesson | PaymentSession;
}
