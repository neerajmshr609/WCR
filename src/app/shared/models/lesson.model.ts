import { PaymentRequestBySeconds } from '../models/payment-request';

export interface Lesson {
  id?: number;
  created_at?: string;
  start?: string;
  meetingtime?: string;
  end?: string;
  teacher_id?: number;
  student_id?: number;
  pronunciation_rate?: number;
  knowledge_rate?: number;
  explanation_rate?: number;
  politeness_rate?: number;
  positive_comment?: string;
  negative_comment?: string;
  token?: string;
  name?: string;
  confirmed?: boolean;
  rated?: boolean;
  finished?: boolean;
  paid?: boolean;
  paymentrequestapproved?: boolean;
  paymentrequestdenied?: boolean;
  conversation_id?: number;
  payment_request?: PaymentRequestBySeconds;
  project_id?: number;
  user_id?: number;
  active?: boolean;
  status?: 'created' | 'process' | 'ended';
  hostName?: string;
}
export class LessonPaymentRequset extends PaymentRequestBySeconds {
  id: number;
  paymentrequestdenied?: boolean;
  paymentrequestapproved?: boolean;
}
