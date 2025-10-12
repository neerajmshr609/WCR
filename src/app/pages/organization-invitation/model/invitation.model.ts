import { IInvitationInfo } from './response/invitation-response.interface';
import { User } from '../../../shared/models/user.model';
import { OrganizationShort } from '../../../shared/models/organizationShort';
import { createHttpParams } from '../../../shared/functions/http-params';

export class Invitation {
  token: string;
  invite_email: string;
  organization: null | Pick<OrganizationShort, 'id' | 'legal_name'> = null;
  user_exists: boolean;
  invitation_by: string;
  invite_type?: 'member' | 'free_consultant';

  isCurrentUserInvited(user: User) {
    return this.invite_email && user.email === this.invite_email;
  }

  toHttpParams() {
    return createHttpParams({ token: this.token });
  }

  toHttpBody() {
    return { token: this.token };
  }
}

export const invitationFactory = (token: string, src: IInvitationInfo) => {
  const dst = new Invitation();
  dst.token = token;

  if (Number.isInteger(src.organization_id) && src.organization_legal_name) {
    dst.organization = {
      id: src.organization_id,
      legal_name: src.organization_legal_name,
    };
  }
  dst.invite_email = src.invite_email;
  dst.user_exists = !!src.user_exists;
  dst.invitation_by = src.invitation_by;

  return dst;
};
