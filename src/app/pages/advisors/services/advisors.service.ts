import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createHttpParams } from 'src/app/shared/functions/http-params';
import { FUNNEL_FOR_ADVISOR_URL, USER_URL } from 'src/config/config';
import { AdvisorsServicesModule } from './advisors-services.module';

@Injectable({
  providedIn: AdvisorsServicesModule,
})
export class AdvisorsService {
  constructor(private http: HttpClient) {}

  fetchFunnelPositionForAdvisor(advisorID: number): Observable<number> {
    const params = createHttpParams({ advisorID });

    return this.http.get<number>(FUNNEL_FOR_ADVISOR_URL, { params });
  }

  addAdvisorToPinned(
    pinned_advisors: number[],
    currentUserId: number,
  ): Observable<void> {
    return this.http.put<void>(USER_URL(currentUserId), { pinned_advisors });
  }
}
