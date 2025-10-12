import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  API_URL,
  FEEDBACK_SESSIONS_INTENT,
  PAYMENT_LESSON_INTENT,
  PAYMENT_SESSION_INTENT,
  TIPS_URL,
} from 'src/config/config';
import { map } from 'rxjs/operators';
import { Balance } from '../shared/models/balance.model';
import { Setting } from '../shared/models/setting.model';
import { StripeDashboardLinks } from '../shared/models/stripe-dashboard-links';
import { Stripeintent } from '../shared/models/stripeintent.model';
import {
  PaymentMethods,
  Transaction,
} from '../shared/models/transaction.model';
import { PaymentRequestTips } from '../shared/models/payment-request';
import { AdminService } from '../pages/admin/admin.service';
import { LastTransactions } from '../pages/usersettings/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  stripeDashboardLinks$ = new BehaviorSubject<StripeDashboardLinks>(null);

  indicatorSHouldUpdateSub = new BehaviorSubject<boolean>(false);
  settings: Setting[];

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
  ) {
    this.adminService.fetchSettings().subscribe((results) => {
      this.settings = results;
    });
  }

  uploadPrice(): number {
    const uploadPrice = this.settings.find((obj) => {
      return obj.name === 'upload_price';
    }).value;
    return uploadPrice;
  }

  freeTierCap(): number {
    return this.settings.find((obj) => {
      return obj.name === 'charges_cap';
    }).value;
  }

  inspiringFeedbackBonus(): number {
    return this.settings.find((obj) => {
      return obj.name === 'inspiring_feedback_bonus';
    }).value;
  }

  payoutAvailableBalance(balance: number) {
    const url = API_URL + 'payout';

    return this.http.post(url, { balance });
  }

  fetchConnectedAccount() {
    const url = API_URL + 'fetch_connected_account';

    return this.http.get<any>(url);
  }

  fetchStripeDashboardLink() {
    const url = API_URL + 'get_dashboard_link/';

    return this.http
      .get<StripeDashboardLinks>(url)
      .pipe(map((res) => this.stripeDashboardLinks$.next(res)));
  }

  fetchStripeBalance() {
    const url = API_URL + 'get_stripe_balance';

    return this.http.get<Balance>(url);
  }

  attachStripeCustomerIDToUser(customer: string) {
    const url = API_URL + 'attach_customer_id_to_user';

    return this.http.post(url, { customer });
  }

  createPaymentIntentForCardSetup() {
    const url = API_URL + 'create_intent_for_card_setup';

    return this.http.post<Stripeintent>(url, {});
  }

  deleteStripeAccount() {
    const url = API_URL + 'delete_stripe_account';

    return this.http.delete<any>(url);
  }

  fetchPaymentMethods(): Observable<PaymentMethods> {
    const url = API_URL + 'fetch_payment_methods';

    return this.http.get<PaymentMethods>(url);
  }

  attachPaymentMethod(payment_id: string): Observable<unknown> {
    const url = API_URL + 'attach_payment_method';

    return this.http.post(url, { payment_id });
  }

  createPaymentIntentForSession(message_payment_session_id: number) {
    return this.http.post<Stripeintent>(PAYMENT_SESSION_INTENT, {
      message_payment_session_id,
    });
  }

  createPaymentIntentForLessons(lesson_id: number) {
    return this.http.post<Stripeintent>(PAYMENT_LESSON_INTENT, { lesson_id });
  }

  createPaymentIntentForProjectFeedback(
    feedbacksession_id: number,
    advisor_income: number = null,
  ) {
    return this.http.post<Stripeintent>(FEEDBACK_SESSIONS_INTENT, {
      feedbacksession_id,
      advisor_income,
    });
  }

  createStripePayoutsUser(code: string) {
    const url = API_URL + 'create_stripe_payouts_account';

    return this.http.post(url, { code });
  }

  createTransaction(userId: number, type: string, value?: number) {
    let settingsValue;

    if (type === 'signup_bonus') {
      settingsValue = this.settings.find((obj) => {
        return obj.name === 'signup_bonus';
      }).value;
    } else if (type === 'upload') {
      settingsValue = this.settings.find((obj) => {
        return obj.name === 'upload_price';
      }).value;
      settingsValue = -Math.abs(settingsValue);
    } else if (type === 'inspiring_feedback') {
      settingsValue = this.settings.find((obj) => {
        return obj.name === 'inspiring_feedback_bonus';
      }).value;
    } else {
      settingsValue = value;
    }

    const url = API_URL + 'transactions/';
    return this.http.post<Transaction>(url, {
      transaction: {
        transactiontype: type,
        value: settingsValue,
        user_id: userId,
      },
    });
  }

  fetchTransactions() {
    const url = API_URL + 'transactions';

    return this.http.get<Transaction[]>(url);
  }

  getPayoutsList() {
    const url = API_URL + 'advisor_payouts_list';
    return this.http.get<LastTransactions[]>(url);
  }

  sendTipsRequest(
    percent: number,
    type: string,
    id: number,
  ): Observable<PaymentRequestTips> {
    return this.http.post(TIPS_URL, { id, type, ...(percent && { percent }) });
  }
}
