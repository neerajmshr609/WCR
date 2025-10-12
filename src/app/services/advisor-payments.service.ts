import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ADVISOR_PAYMENTS_URL } from 'src/config/config';

@Injectable({
  providedIn: 'root',
})
export class AdvisorPaymentsService {
  constructor(private http: HttpClient) {}

  public getAdvisorPayments() {
    return this.http.get(ADVISOR_PAYMENTS_URL);
  }
}
