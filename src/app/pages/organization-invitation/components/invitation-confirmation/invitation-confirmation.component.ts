import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { OrganizationInvitationService } from '../../service/organization-invitation.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../auth/auth.service';
import { AUTH_MODE } from '../../../../auth/model/auth-mode';
import { OrganizationShort } from '../../../../shared/models/organizationShort';
import { filter, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConditionsComponent } from '../conditions/conditions.component';

@Component({
  selector: 'app-invitation-confirmation',
  templateUrl: './invitation-confirmation.component.html',
  styleUrls: ['./invitation-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationConfirmationComponent implements OnInit {
  readonly token = input<string>();
  private readonly destroyRef = inject(DestroyRef);
  readonly displayConditions = signal(true);
  readonly isSignedInUser = toSignal(this._authService.userIsSignedIn$);
  readonly invitation = toSignal(this._invitationService.invitation$);
  readonly invitedUserExists = computed(() => !!this.invitation()?.user_exists);
  readonly invitationEmail = computed(() => this.invitation()?.invite_email);
  readonly invitedIntoOrganization = computed<
    Pick<OrganizationShort, 'id' | 'legal_name'>
  >(() => this.invitation()?.organization);
  readonly AUTH_MODES = AUTH_MODE;
  private dialogRef: MatDialogRef<ConditionsComponent> | undefined;

  constructor(
    private readonly _invitationService: OrganizationInvitationService,
    private readonly _authService: AuthService,
    private dialog: MatDialog,
  ) {}

  acceptConditions() {
    this.displayConditions.set(false);
    combineLatest([
      this._authService.userIsSignedIn$,
      this._invitationService.currentUserInvited$,
    ])
      .pipe(
        filter(
          ([isSignedIn, currentUserInvited]) =>
            isSignedIn && currentUserInvited,
        ),
        take(1),
      )
      .subscribe(() => {
        this._invitationService.acceptInvitation();
      });
  }

  declineConditions() {
    this._invitationService.declineInvitation();
  }

  ngOnInit(): void {
    const token = this.token();
    if (token) {
      this._invitationService.logoutAndFetchInvitation(token).subscribe({
        next: (_) => this._invitationService.setInvitation(_),
        complete: () => this._invitationService.completeLoading(),
        error: () => {
          this.dialogRef.close();
          this.displayConditions.set(false);
        },
      });
    }

    if (this.displayConditions()) {
      setTimeout(() => {
        this.dialogRef = this.dialog.open(ConditionsComponent, {
          autoFocus: false,
          maxWidth: '498px',
          width: '100%',
        });

        this.dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res: { status: boolean }) => {
            if (!res) {
              return;
            }

            if (res.status) {
              this.acceptConditions();
            } else {
              this.declineConditions();
            }
          });
      }, 500);
    }
  }
}
