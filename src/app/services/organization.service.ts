import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationShort } from '../shared/models/organizationShort';
import { Observable } from 'rxjs';
import {
  IFormOrgRowDataModel,
  IOrgPartner,
  IOrgs,
} from '../pages/usersettings/interfaces';
import {
  ORG_PARTNER_GET_URL,
  ORG_PARTNER_URL,
  ORG_PARTNERS_URL,
  PENDING_ORGANIZATION_URL,
  PENDING_ORGANIZATIONS_URL,
} from 'src/config/config';
import { environment } from '../../environments/environment';
import { IOrganization } from '../pages/usersettings/interfaces';
import { ORGANIZATION_URL, ORGANIZATIONS_URL } from 'src/config/config';

@Injectable()
export class OrganizationService {
  constructor(private http: HttpClient) {}

  public getOrganization(): Observable<IOrganization> {
    return this.http.get<IOrganization>(ORGANIZATIONS_URL);
  }

  public updateOrganizations(
    org: Partial<IOrganization>,
    id: number,
  ): Observable<IOrganization> {
    return this.http.put<IOrganization>(ORGANIZATION_URL(id), org);
  }

  public deleteOrganizations(id: number): Observable<IOrganization> {
    return this.http.delete<IOrganization>(ORGANIZATION_URL(id));
  }

  public updateOrgPartners(
    partner: IFormOrgRowDataModel,
    id: number,
  ): Observable<unknown> {
    return this.http.put(ORG_PARTNER_URL(id), partner);
  }

  public deleteOrgPartners(id: number): Observable<unknown> {
    return this.http.delete(ORG_PARTNER_URL(id));
  }

  public createOrgPartners(partner: IFormOrgRowDataModel): Observable<unknown> {
    return this.http.post(ORG_PARTNERS_URL, partner);
  }

  public getOrganizationsList(): Observable<OrganizationShort[]> {
    return this.http.get<OrganizationShort[]>(
      `${environment.apiUrl}organizations/all_active_organizations`,
    );
  }

  public createOrganizations(
    org: Partial<IOrganization>,
  ): Observable<IOrganization> {
    return this.http.post<IOrganization>(ORGANIZATIONS_URL, org);
  }

  public getOrgPartners(organizationId: number): Observable<IOrgPartner[]> {
    return this.http.get<IOrgPartner[]>(ORG_PARTNER_GET_URL(organizationId));
  }

  public getPendingOrgs(): Observable<IOrgs> {
    return this.http.get<IOrgs>(PENDING_ORGANIZATIONS_URL);
  }

  public changePendingOrgStatus(
    id: number,
    org: IOrganization,
  ): Observable<IOrganization[]> {
    return this.http.put<IOrganization[]>(PENDING_ORGANIZATION_URL(id), org);
  }
}
