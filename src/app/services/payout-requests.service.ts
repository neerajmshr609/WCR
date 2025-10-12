import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CURRENT_PAYOUT_REQUEST_URL,
  PAYOUT_REQUESTS_URL,
  PAYOUT_REQUEST_URL,
  PAYOUT,
  INVOICES_LIST,
} from 'src/config/config';
import { PayoutRequest } from '../shared/models/payout-request.model';
import { Observable } from 'rxjs';
import { Invoice } from '../shared/models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class PayoutRequestsService {
  constructor(private http: HttpClient) {}

  public getCurrentPayoutRequest() {
    return this.http.get(CURRENT_PAYOUT_REQUEST_URL);
  }

  public createPayoutRequest(request: PayoutRequest) {
    return this.http.post(PAYOUT_REQUESTS_URL, request);
  }

  public editPayoutRequest(id: number, request: PayoutRequest) {
    return this.http.put(PAYOUT_REQUEST_URL(id), request);
  }

  public deletePayoutRequest(id: number) {
    return this.http.delete(PAYOUT_REQUEST_URL(id));
  }

  public payout(): Observable<unknown> {
    return this.http.post(PAYOUT, undefined);
  }

  public getInvoicesList(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(INVOICES_LIST);
  }
}
