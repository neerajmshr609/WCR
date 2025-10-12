import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ESCALATE_REQUEST } from '../../../../config/config';

@Injectable()
export class EscalationService {
  constructor(private http: HttpClient) {}

  public escalateRequest(conversation_id: number) {
    return this.http.put(
      `${ESCALATE_REQUEST}/?conversation_id=${conversation_id}`,
      {},
    );
  }
}
