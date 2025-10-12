import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  COMMING_SOON,
  MENU_ITEMS_FOR_CONSULT_AND_ORG_MEMBER,
  MENU_ITEMS_FOR_ORG_ADMIN,
  MENU_ITEMS_FOR_USER_WITHOUT_PERMISSIONS,
} from './constants/';
import { Subscription } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import { User } from 'src/app/shared/models/user.model';
import { ComingSoon, IOrganization } from './interfaces';
import { IMenuItem } from '../../main-content-menu/model/menu-item';
import { PermissionService } from 'src/app/auth/service/permission.service';
import { CREATE_ORG } from './constants/menu-items';
import { OrganizationService } from 'src/app/services/organization.service';
import { SkillsService } from '../../services/skill/skills.service';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.scss'],
})
export class UsersettingsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private savingSub: Subscription;

  menuItems = signal<IMenuItem[]>([]);
  selectedMenu: string = '';
  currentUser: User;
  comingSoon: ComingSoon[] = COMMING_SOON;
  currentPermissions = signal<Permissions>(null);
  organization = signal<IOrganization | null>(null);

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private uploaderService: UploaderService,
    private permissionService: PermissionService,
    private organizationService: OrganizationService,
    private skillService: SkillsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.skillService.fetchSkills();
    this.permissionService.permissions$
      .pipe(takeUntil(this.destroyed))
      .subscribe((permissions) => {
        if (permissions.isOrganizationAdmin()) {
          this.menuItems.set(MENU_ITEMS_FOR_ORG_ADMIN);
        } else if (permissions.isCounselor()) {
          this.menuItems.set(MENU_ITEMS_FOR_CONSULT_AND_ORG_MEMBER);
        } else {
          this.menuItems.set(MENU_ITEMS_FOR_USER_WITHOUT_PERMISSIONS);
        }

        if (
          !['pending', 'accepted'].includes(
            this.authService.userSubject$.value.org_member_state,
          )
        ) {
          const currentMenuItems = this.menuItems();
          this.menuItems.set([...currentMenuItems, CREATE_ORG]);

          this.setMenuItems();
        }
      });

    this.authService.userSubject$
      .pipe(
        filter((res) => !!res),
        tap((user) => {
          this.currentUser = user;
        }),
      )
      .subscribe();
  }

  private setMenuItems(): void {
    this.organizationService
      .getOrganization()
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        this.organization.set(res);
      });
  }

  onSave(body?: Partial<User>): void {
    this.savingSub?.unsubscribe();

    this.savingSub = this.authService
      // TODO need fix typing
      // @ts-ignore
      .updateUser({
        ...body,
        id: this.currentUser.id,
      })
      .pipe(
        takeUntil(this.destroyed),
        tap(() => {
          this.snackBar.open('Saved!', null, { duration: 1000 });
        }),
      )
      .subscribe();
  }

  didSelectMenuItem(item: IMenuItem): void {
    this.selectedMenu = item.param;
  }

  ngOnDestroy(): void {
    this.uploaderService.destroy();
    super.ngOnDestroy();
  }

  deleteOrgVisually($event): void {
    if ($event) {
      this.organization.set(null);
    }
  }
}
