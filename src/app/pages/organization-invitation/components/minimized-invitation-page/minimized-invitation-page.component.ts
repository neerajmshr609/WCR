import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrganizationInvitationService } from '../../service/organization-invitation.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent, UISizes } from '../../../../shared/UIkit/button/button.component';
import { IconUserPlusComponent } from '../../../../shared/icons/icon-user-plus/icon-user-plus.component';
import { TranslateModule } from '@ngx-translate/core';
import { ResizeService } from '../../../../services/resize.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-minimized-invitation-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconUserPlusComponent, TranslateModule],
  templateUrl: './minimized-invitation-page.component.html',
  styleUrls: ['./minimized-invitation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimizedInvitationPageComponent {
  readonly invitation = toSignal(this._invitationService.invitation$);
  readonly invitationPageUrlSegments = toSignal(this._invitationService.invitationPageUrlSegments$);
  readonly buttonSize: Signal<UISizes> = toSignal(this._resize.sizeOfDevice$.pipe(map(({ isLarge, isMedium }) => {
    return isMedium ? 'medium' : isLarge ? 'large' : 'small';
  })));

  constructor(
    private readonly _router: Router,
    private readonly _invitationService: OrganizationInvitationService,
    private readonly _resize: ResizeService,
  ) {
  }

  navigateToInvitationPage(): void {
    this._router.navigate(this.invitationPageUrlSegments());
  }
}
