import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permission } from 'src/app/shared/models/permissions.model';
import {
  PERMISSION_DELETE_URL,
  PERMISSION_URL,
  PERMISSIONS_URL,
} from 'src/config/config';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionsService {
  constructor(private http: HttpClient) {}

  public fetchUserPermissions(user_id: number) {
    return this.http.get<{ success: boolean; user_permissions: string[] }>(
      PERMISSION_URL(user_id),
    );
  }

  public deleteUserPermissions(permission: string, user_id: number) {
    return this.http.delete(PERMISSION_DELETE_URL(permission, user_id));
  }

  public createUserPermissions(permission: string, user_id: number) {
    return this.http.post<Permission>(PERMISSIONS_URL, {
      permission: permission,
      user_id,
    });
  }
}
