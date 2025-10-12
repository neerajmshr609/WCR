import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ORGANIZATION_PROFILE_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
import { IOrganizationProfileDataResponse } from './components/model/responses/organization-profile-response.interface';
import { map } from 'rxjs/operators';
import { organizationProfileFactory } from './components/model/organization-profile.model';

export interface INgoContactMessage {
  name?: string;
  surname?: string;
  email?: string;
  message?: string;
}

@Injectable({
  providedIn: 'any',
})
export class OrganizationsService {
  constructor(private http: HttpClient) {}

  getOrganizationByName(shortName: string) {
    const url = ORGANIZATION_PROFILE_URL + shortName;
    return this.http
      .get<IOrganizationProfileDataResponse>(url)
      .pipe(map(({ data }) => organizationProfileFactory(data)));
  }

  sendMessage(
    organizationId: number,
    message: INgoContactMessage,
  ): Observable<any> {
    // TODO: Need to change this logic after backend implementation
    return of(true);
  }
}
