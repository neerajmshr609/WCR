import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IButtonNavigationItem } from '@ui-kit/buttons/button-navigation-item/button-navigation-item.interface';
import { IconGlobeComponent } from '@icons/icon-globe/icon-globe.component';
import { IconHelpCircleComponent } from '@icons/icon-help-circle/icon-help-circle.component';
import { IconCapsuleClosedComponent } from '@icons/icon-capsule-closed/icon-capsule-closed.component';
import { IconOrgChatComponent } from '@icons/icon-org-chat/icon-org-chat.component';
import {
  ASK_A_QUESTION_CHILD_PATH,
  CAPSULE_CHILD_PATH,
  ORGANIZATIONS_CHILD_PATH,
  WEBLINKS_CHILD_PATH,
} from '../../routing/profile.paths';
import { toSignal } from '@angular/core/rxjs-interop';
import { PermissionService } from '../../../../auth/service/permission.service';

@Component({
  selector: 'app-profile-navigation',
  templateUrl: './profile-navigation.component.html',
  styleUrls: ['./profile-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileNavigationComponent {
  private readonly isSignedInCounselor = toSignal(
    this.permissionService.isCounselor$,
  );
  readonly navigationItems = signal<IButtonNavigationItem[]>([]);

  constructor(private permissionService: PermissionService) {
    if (this.isSignedInCounselor()) {
      this.navigationItems.set([
        // TODO It will be implemented later
        // {
        //   icon: IconGlobeComponent,
        //   title: 'profile-navigation.weblinks',
        //   path: WEBLINKS_CHILD_PATH.toRelativeUrl (),
        // },
        // {
        //   icon: IconHelpCircleComponent,
        //   title: 'profile-navigation.ask_a_question',
        //   path: ASK_A_QUESTION_CHILD_PATH.toRelativeUrl (),
        // },
        {
          icon: IconCapsuleClosedComponent,
          title: 'profile-navigation.capsules',
          path: CAPSULE_CHILD_PATH.toRelativeUrl(),
          permission: ['consult'],
        },
        // TODO It will be implemented later
        // {
        //   icon: IconOrgChatComponent,
        //   title: 'profile-navigation.organizations',
        //   path: ORGANIZATIONS_CHILD_PATH.toRelativeUrl (),
        // },
      ]);
    } else {
      this.navigationItems.set([
        // TODO It will be implemented later
        // {
        //   icon: IconGlobeComponent,
        //   title: 'profile-navigation.weblinks',
        //   path: WEBLINKS_CHILD_PATH.toRelativeUrl (),
        // },
        // {
        //   icon: IconHelpCircleComponent,
        //   title: 'profile-navigation.ask_a_question',
        //   path: ASK_A_QUESTION_CHILD_PATH.toRelativeUrl (),
        // },
        // {
        //   icon: IconOrgChatComponent,
        //   title: 'profile-navigation.organizations',
        //   path: ORGANIZATIONS_CHILD_PATH.toRelativeUrl (),
        // },
      ]);
    }
  }
}
