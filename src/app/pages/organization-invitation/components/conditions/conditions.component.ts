import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrganizationInvitationService } from '../../service/organization-invitation.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionsComponent {
  readonly invitation = toSignal(this._invitationService.invitation$);
  readonly acceptConditions = output<void>();
  readonly declineConditions = output<void>();
  constructor(
    private dialogRef: MatDialogRef<ConditionsComponent>,
    private readonly _invitationService: OrganizationInvitationService,
  ) {}

  public accept(): void {
    this.dialogRef.close({ status: true });
  }

  public deny(): void {
    this.dialogRef.close({ status: false });
  }
}
