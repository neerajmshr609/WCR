import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADVISOR_DATES_URL, ADVISOR_PROFILE_URL } from 'src/config/config';
import { Advisordate } from '../shared/models/Advisordate.model';
import { User } from '../shared/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdvisorsService {
  publicProfile = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  createAdvisorDate(user_id: number, day: number, time: number) {
    return this.http.post<Advisordate>(ADVISOR_DATES_URL, {
      user_id,
      day,
      time,
    });
  }

  deleteAdvisorDate(id: number) {
    const url = ADVISOR_DATES_URL + id;
    return this.http.delete<Advisordate>(url);
  }

  fetchAdvisorProfile(user_id: number) {
    const url = ADVISOR_PROFILE_URL + user_id;
    return this.http
      .get<User>(url)
      .pipe(tap((res: User) => this.publicProfile.next(res)));
  }
}
