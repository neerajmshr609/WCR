import { NewsfeedFeedback } from './newsfeedfeedback.model';
import { PaymentRequestBySeconds, PaymentRequestTips } from './payment-request';
import { PaymentSessionStatuses } from './payment-session';

export interface FeedbackSession {
  id: number;
  last_feedback_date: string;
  status: PaymentSessionStatuses;
  created_at: string;
  commenter: {
    id: number;
    name: string;
    city: string;
    sharetoken: string;
  };
  payment_request: PaymentRequestBySeconds;
  paymentamount: number;
  tip: PaymentRequestTips;
  feedbacks: NewsfeedFeedback[];
  feedbacks_count: number;
}
