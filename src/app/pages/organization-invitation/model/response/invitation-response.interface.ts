import { IResponseBaseWrap } from '../../../../shared/models/response/_base-wrap.interface';

export interface IInvitationResponse extends IResponseBaseWrap {
  data: {
    invite_info: IInvitationInfo
  };
}

export interface IInvitationInfo {
  invite_email: string;
  organization_id: number;
  organization_legal_name: string;
  user_exists: boolean;
  invitation_by: string;
}