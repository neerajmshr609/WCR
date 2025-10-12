import { Message } from './message.model';
import { PaymentRequestBySeconds } from './payment-request';

export type PaymentSessionStatuses =
  | 'created'
  | 'awaiting_payment'
  | 'denied'
  | 'approved';

export class PaymentSession {
  constructor(
    public id?: number,
    public created_at?: string,
    public last_message_date?: string,
    public messages?: Message[],
    public payment_request?: PaymentRequestBySeconds,
    public status?: PaymentSessionStatuses,
    public read?: boolean,
    public session_type?: string,
  ) {}
}
