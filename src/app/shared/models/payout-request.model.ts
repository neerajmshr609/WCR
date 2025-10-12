import { FormControl } from '@angular/forms';

export type PayoutStatus =
  | 'created'
  | 'in_progress'
  | 'success'
  | 'declined'
  | 'error';

export interface PayoutRequest {
  id?: number;
  advisor_payment_id?: number;
  created_at?: Date;
  completed_at?: Date;
  deleted_at?: Date;
  username?: string;
  email?: string;
  status?: PayoutStatus;

  comment?: string;
  amount_requested?: number;
  currency?: string;
  wallet_to?: string;

  wallet_from?: string;
  amount_sent?: number;
  reason_declined?: string;

  account_holders_name?: string;
  account_number?: string;
  swift_bic?: string;
  bank_info?: string;
}
