import {
  Component,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { InvitePopupComponent } from '../../invite-popup/invite-popup.component';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../../../services/user-management.service';
import { IOrganization } from '../../../interfaces';
import { TranslateService } from '@ngx-translate/core';
import { InviteUserRole } from '../../../../../shared/models/user.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FiltersComponent implements OnInit {
  public organization = input<IOrganization>();
  activeUsersCount = input(0);
  filter = output<string>();

  selectedFilter = signal<string>('all');

  private inviteRoles = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userManagementService: UserManagementService,
    private translate: TranslateService,
  ) {}

  public invite(): void {
    const dialogRef = this.dialog.open(InvitePopupComponent, {
      data: {
        organization: this.organization()?.legal_name,
        roles: this.inviteRoles,
      },
      autoFocus: false,
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result),
        switchMap((invited) =>
          this.userManagementService.inviteMember({
            email: invited.email,
            invite_type: invited.role,
          }),
        ),
        catchError((err: HttpErrorResponse) => {
          if (err.error.email) {
            this.snackBar.open(err.error.email, null, { duration: 2000 });
          }
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.snackBar.open(`The user has been invited`, null, {
          duration: 2000,
        });
      });
  }

  filterUsers(type: string): void {
    this.filter.emit(type);
    this.selectedFilter.set(type);
  }

  ngOnInit(): void {
    combineLatest([
      this.translate.get('inviteUser.client_counsellor'),
      this.translate.get('inviteUser.member'),
    ])
      .pipe(take(1))
      .subscribe(([clientCounsellor, member]) => {
        this.inviteRoles = [
          { name: InviteUserRole.FREECONSUL, title: clientCounsellor },
          { name: InviteUserRole.MEMBER, title: member },
        ];
      });
  }
}
