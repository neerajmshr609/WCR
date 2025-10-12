import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisteredUser, IRegisteredUsers } from '../shared/models/user.model';
import {
  FREE_CONSULTANTS,
  ORG_MEMBER_URL,
  REGISTERED_USER_URL,
  USER_PERSONAL_INFO_DELETE_URL,
} from 'src/config/config';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public fetchActiveUsers(isActive: boolean) {
    return this.http.get<IRegisteredUsers>(REGISTERED_USER_URL(isActive));
  }

  public updateUser(user: IRegisteredUser) {
    return this.http.put(FREE_CONSULTANTS(user.id), user);
  }

  public deleteUserPersonalInfo(id: number) {
    return this.http.delete(USER_PERSONAL_INFO_DELETE_URL(id));
  }

  public approvePendingUser(user: IRegisteredUser) {
    return this.http.put(ORG_MEMBER_URL(user.id), user);
  }
}
