import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InviteUserRole } from '../../../shared/models/user.model';
import { Observable } from 'rxjs';
import { INVITE_USER } from '../../../../config/config';

@Injectable()
export class UserManagementService {
  constructor(private http: HttpClient) {}

  public inviteMember(data: {
    invite_type: InviteUserRole;
    email: string;
  }): Observable<any> {
    return this.http.post(INVITE_USER, data);
  }
}
