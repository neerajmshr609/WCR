import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationConfirmationComponent } from '../components/invitation-confirmation/invitation-confirmation.component';


export const ACCEPT_ORG_INVITATION_URL_SEGMENTS = ['organizations', 'get_invite_info'];
export const ACCEPT_ORG_INVITATION_PATH = ACCEPT_ORG_INVITATION_URL_SEGMENTS.join('/');
export const ACCEPT_ORG_INVITATION_URL_SEGMENTS_WITH = (token: string) => [... ACCEPT_ORG_INVITATION_URL_SEGMENTS, token];
const routes: Routes = [
  {
    path: ':token',
    component: InvitationConfirmationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationInvitationRoutingModule {
}
