import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { USER_PERMISSIONS } from '../../constants/forms';
import { IFormInput, IOrganization } from '../../interfaces';
import {
  IRegisteredUser,
  User,
  UserEmailsInvitedToOrg,
} from 'src/app/shared/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { OrganizationService } from '../../../../services/organization.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPermissionsComponent implements OnInit {
  currentUser = input<User>();
  users = signal<(IRegisteredUser | UserEmailsInvitedToOrg)[]>([]);
  pendingUsers = signal<(IRegisteredUser | UserEmailsInvitedToOrg)[]>([]);
  activeUsers = signal<IRegisteredUser[]>([]);
  organization = signal<IOrganization>(null);
  private activeType = signal('all');

  form: FormGroup;
  formData: IFormInput[] = USER_PERMISSIONS;
  expandedPermissionsId = 0;

  constructor(
    private userService: UsersService,
    private organizationService: OrganizationService,
  ) {}

  ngOnInit() {
    this.getRegisteredUsers(false);
    this.organizationService.getOrganization().subscribe((res) => {
      this.organization.set(res);
    });
  }

  private getRegisteredUsers(isActive: boolean): void {
    this.userService.fetchActiveUsers(isActive).subscribe((res) => {
      this.users.set(res.users.data);
      this.activeUsers.set(
        res.users.data.filter(
          (f) =>
            f.state === 'approved' || f.free_consultants_status === 'approved',
        ),
      );
      const invited = res.user_emails_invited_to_org.map((user) => ({
        ...user,
        state: 'invited',
      }));
      const pending = res.users.data.filter(
        (f) => f.state === 'pending' || f.free_consultants_status === 'pending',
      );
      this.pendingUsers.set([...invited, ...pending]);
    });
  }

  expandUserPermissionCard(id: number): void {
    this.expandedPermissionsId = id;
  }

  filterUsers(type: string) {
    this.activeType.set(type);
    if (this.activeType() === 'all') {
      this.getRegisteredUsers(false);
    }
    if (this.activeType() === 'active') {
      this.users.set(this.activeUsers());
    }
    if (this.activeType() === 'pending') {
      this.users.set(this.pendingUsers());
    }
  }

  public handleApprove(approvedUser: IRegisteredUser) {
    if (this.activeType() === 'pending') {
      let users = this.pendingUsers();
      users = users.filter((user) => user.id !== approvedUser.id);
      this.pendingUsers.set(users);
      this.users.set(this.pendingUsers());
    }
    if (this.activeType() === 'all') {
      let users = this.users();
      users = users.map((user) =>
        user.id === approvedUser.id ? { ...user, state: 'approved' } : user,
      );
      this.users.set(users);
    }
    if (this.activeType() === 'active') {
      let users = this.activeUsers();
      users = users.map((user) =>
        user.id === approvedUser.id ? { ...user, state: 'approved' } : user,
      );
      this.activeUsers.set(users);
      this.users.set(this.activeUsers());
    }
  }
}
