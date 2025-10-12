import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../../config/config';

@Injectable()
export class SkillSelectService {
  constructor(private readonly http: HttpClient) {}

  canFindSkill(body: { text: string; email: string }): Observable<unknown> {
    return this.http.post(`${API_URL}/submit_topic`, body);
  }
}
